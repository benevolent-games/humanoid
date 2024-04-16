
import {Id, Rapier, quat, vec3} from "@benev/toolbox"

import {World} from "../../hub.js"
import {Ribbon} from "../../../models/tracing/ribbon.js"
import {Tracing} from "../../../models/tracing/types.js"
import {Health} from "../../components/topics/warrior.js"
import {HuPhysics} from "../../../models/realm/physics.js"
import {Infirmary} from "../../../models/facilities/infirmary.js"
import { MeleeReport } from "../../../models/activity/reports/melee.js"
import { Activity } from "../../../models/activity/exports.js"

const {xyz} = vec3.to
const {xyzw} = quat.to

export function processHits({
		entityId, world, physics, ribbon, edge, activity,
	}: {
		entityId: Id
		world: World
		physics: HuPhysics,
		ribbon: Ribbon,
		edge: Tracing.RibbonEdge,
		activity: Activity.Melee,
	}) {

	const noPosition = xyz(vec3.zero())
	const noRotation = xyzw(quat.identity())
	const hits = [] as Rapier.Collider[]
	const hitCallback = (hit: Rapier.Collider): boolean => {
		hits.push(hit)
		return true
	}
	function triangulate(...triangles: Tracing.Triangle[]) {
		return triangles.map(t => new Rapier.Triangle(
			xyz(t[0]),
			xyz(t[1]),
			xyz(t[2])),
		)
	}
	const triangles = triangulate(...edge.triangles)

	for (const tri of triangles) {
		physics.world.intersectionsWithShape(
			noPosition,
			noRotation,
			tri,
			hitCallback,
			undefined,
			physics.grouper.specify({
				filter: [physics.groups.level, physics.groups.dynamic, physics.groups.capsule],
				membership: [physics.groups.sensor],
			}),
		)
	}

	const [hit] = hits

	if (hit) {
		const capsule = physics.capsules.get(hit)
		const we_are_not_hitting_ourselves = capsule?.entityId !== entityId

		if (we_are_not_hitting_ourselves)
			activity.cancelled = activity.seconds

		const dynamic = physics.dynamics.get(hit)
		if (dynamic && edge.vector) {
			dynamic.rigid.applyImpulseAtPoint(
				vec3.to.xyz(vec3.multiplyBy(edge.vector, 1_000)),
				dynamic.rigid.translation(),
				true,
			)
		}

		if (capsule) {
			if (we_are_not_hitting_ourselves) {
				const entity = world.get(capsule.entityId)
				if (entity.has({Health})) {
					const infirmary = new Infirmary(entity.components.health)
					infirmary.applyDamage(activity, ribbon)
				}
			}
		}

		return ribbon
	}

	return null
}

