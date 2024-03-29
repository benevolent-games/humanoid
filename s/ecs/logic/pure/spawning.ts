
import {Archetypes} from "../../archetypes.js"
import {Relations} from "../utils/relations.js"
import {system, behavior, arch} from "../../hub.js"
import {SpawnIntent, Spawned} from "../../schema/schema.js"

export const spawning = system("spawning", ({world, realm}) => {
	const spawnedQuery = world.query({Spawned})

	function getSpawned() {
		const [spawned] = spawnedQuery.matches
		return spawned
			? spawned
			: undefined
	}

	return [
		behavior("spawn intentions")
			.select({SpawnIntent})
			.logic(() => ({components: {spawnIntent}}) => {
				const {buttons} = realm.tact.inputs.humanoid

				if (buttons.respawn.pressed) {
					spawnIntent.respawn = true
					console.log("pressed respawn")
				}

				if (buttons.bot_spawn.pressed)
					spawnIntent.bot_spawn = true

				if (buttons.bot_delete.pressed)
					spawnIntent.bot_delete = true
			}),

		behavior("actuate spawning")
			.select({SpawnIntent})
			.logic(() => ({components: {spawnIntent}}) => {
				const spawned = getSpawned()

				if (!spawned) {
					if (spawnIntent.respawn) {
						console.log("respawn")
						const humanoid = world.create(Archetypes.humanoid({
							debug: false,
							gimbal: [0, 0],
							position: [0, 10, 0],
							perspective: "first_person",
						}))
						const spawnTracker = world.create(arch({Spawned}, {spawned: {}}))
						Relations.parent(world, humanoid, spawnTracker)
					}

					if (spawnIntent.bot_spawn) {
						console.log("bot_spawn")
					}

					if (spawnIntent.bot_delete) {
						console.log("bot_delete")
					}
				}

				spawnIntent.respawn = false
				spawnIntent.bot_spawn = false
				spawnIntent.bot_delete = false
			}),
	]
})

