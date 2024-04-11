
import {Rapier, quat, vec3} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {Tracers} from "../components/hybrids/tracers/tracers.js"
import {Tracing} from "../components/hybrids/tracer/parts/types.js"
import {Character} from "../components/hybrids/character/character.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {Health, Inventory, MeleeAction} from "../components/topics/warrior.js"

export const melee_tracers = system("melee tracers", ({world, realm}) => [

	behavior("tracers")
		.select({Character, MeleeAction, Tracers, Inventory})
		.logic(() => entity => {
			const {physics} = realm
			const {character, meleeAction, tracers} = entity.components

			const releasePhase = Melee.is.attack(meleeAction)
				&& meleeAction.report.phase === "release"

			const inventory = new InventoryManager(entity.components.inventory)
			const ensemble = releasePhase
				? character.weaponEnsembles.get(inventory.weaponName)
				: null

			const blueprint = ensemble
				? ensemble.makeRibbonBlueprint()
				: null

			tracers.update({blueprint})

			if (releasePhase) {
				const wip = tracers.wip ?? []

				for (const info of wip.filter(w => w.edge)) {
					const edge = info.edge!
					const {xyz} = vec3.to
					const {xyzw} = quat.to
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
						const we_are_not_hitting_ourselves = capsule?.entityId !== entity.id

						if (we_are_not_hitting_ourselves)
							meleeAction.earlyRecovery = meleeAction.seconds

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
								if (entity.has({Health}))
									entity.components.health.hp = 0
							}
						}
					}
				}
			}
		}),
])

