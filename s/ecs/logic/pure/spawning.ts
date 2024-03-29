
import {Trashcan} from "@benev/toolbox"

import {Archetypes} from "../../archetypes.js"
import {Relations} from "../utils/relations.js"
import {blank_spawn_intent} from "../utils/spawns.js"
import {system, behavior, arch, responder} from "../../hub.js"
import {Parent, SpawnIntent, SpawnTracker} from "../../schema/schema.js"

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
			.select({SpawnIntent})
			.respond(entity => {
				const {components: {spawnIntent}} = entity
				const {mark, dispose} = new Trashcan()
				const {buttons} = realm.tact.inputs.humanoid

				mark(buttons.respawn.onPressed(() => {
					spawnIntent.respawn = true
				}))

				return dispose
			}),

		behavior("actuate spawning")
			.select({SpawnIntent})
			.logic(() => ({components: {spawnIntent}}) => {
				const spawnTracker = getSpawnTrackerEntity()

				if (spawnIntent.respawn) {
					if (spawnTracker) {
						world.get(spawnTracker.components.parent).dispose()
					}
					else {
						const humanoid = world.create(Archetypes.humanoid({
							debug: false,
							gimbal: [0, 0],
							position: [0, 10, 0],
							perspective: "first_person",
						}))
						const spawnTracker = world.create(
							arch({SpawnTracker}, {spawnTracker: {}})
						)
						Relations.parent(world, humanoid, spawnTracker)
					}
				}

				Object.assign(spawnIntent, blank_spawn_intent())
			}),
	]
})

