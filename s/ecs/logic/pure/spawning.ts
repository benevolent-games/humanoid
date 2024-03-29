
import {Trashcan, vec3} from "@benev/toolbox"

import {Archetypes} from "../../archetypes.js"
import {Relations} from "../utils/relations.js"
import {blank_spawner_state} from "../utils/spawns.js"
import {system, behavior, arch, responder} from "../../hub.js"
import {Gimbal, Parent, Position, Spawner, SpawnTracker} from "../../schema/schema.js"

export const spawning = system("spawning", ({world, realm}) => {
	const spawnedQuery = world.query({SpawnTracker, Parent})

	function getSpawnTrackerEntity() {
		const [entity] = spawnedQuery.matches
		return entity
			? entity
			: undefined
	}

	return [
		responder("spawning")
			.select({Spawner})
			.respond(entity => {
				const {mark, dispose} = new Trashcan()
				const {buttons} = realm.tact.inputs.humanoid

				mark(buttons.respawn.onPressed(() => {
					entity.components.spawner.inputs.respawn = true
				}))

				return dispose
			}),

		behavior("actuate spawning")
			.select({Spawner})
			.logic(() => ({components: {spawner}}) => {
				const spawnTracker = getSpawnTrackerEntity()

				if (spawner.inputs.respawn) {
					if (spawnTracker) {
						const player = world.get(spawnTracker.components.parent)
						if (player.has({Gimbal, Position})) {
							spawner.starting_at.gimbal = player.components.gimbal
							spawner.starting_at.position = player.components.position
						}
						player.dispose()
					}
					else {
						const player = world.create(Archetypes.humanoid({
							debug: false,
							perspective: "first_person",
							gimbal: spawner.starting_at.gimbal,
							position: vec3.add(spawner.starting_at.position, [0, 1, 0]),
						}))
						const spawnTracker = world.create(
							arch({SpawnTracker}, {spawnTracker: {}})
						)
						Relations.parent(world, player, spawnTracker)
					}
				}

				spawner.inputs = blank_spawner_state().inputs
			}),
	]
})

