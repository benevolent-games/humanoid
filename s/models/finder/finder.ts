
import {Rapier, Vec3, vec3} from "@benev/toolbox"

import {HuPhysics} from "../realm/physics.js"
import {Entity, World} from "../../ecs/hub.js"
import {Capsule} from "../../ecs/components/hybrids/capsule.js"

const {xyz} = vec3.to

export type RayHit = {
	normal: Vec3
	distance: number
	collider: Rapier.Collider
}

export type RayParams = {
	origin: Vec3,
	direction: Vec3,
	maxDistance: number,
	ignoreColliders: Rapier.Collider[],
}

export class Finder {
	constructor(public physics: HuPhysics) {}

	rayCast({origin, direction, maxDistance, ignoreColliders}: RayParams) {
		const {physics} = this
		const hits: RayHit[] = []
		const ray = new Rapier.Ray(xyz(origin), xyz(direction))
		physics.world.intersectionsWithRay(ray, maxDistance, true, hit => {
			hits.push({
				distance: hit.timeOfImpact,
				collider: hit.collider,
				normal: vec3.from.xyz(hit.normal),
			})
			return true
		})
		return hits
			.filter(hit => !ignoreColliders.includes(hit.collider))
			.sort((a, b) => a.distance - b.distance)
	}

	rayCastForCapsules(ecsWorld: World, params: RayParams) {
		return this.rayCast(params)
			.map(hit => ({hit, capsule: this.physics.capsules.get(hit.collider)}))
			.filter(result => !!result.capsule)
			.map(result => {
				const hit = result.hit
				const {entityId, rigid} = result.capsule!
				const entity = ecsWorld.get(entityId) as Entity<{Capsule: typeof Capsule}>
				return {...hit, entity, entityId, rigid}
			})
	}
}

