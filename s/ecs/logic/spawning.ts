
import {Trashcan} from "@benev/toolbox"

import {Archetypes} from "../archetypes.js"
import {system, behavior, responder} from "../hub.js"
import {blank_spawner_state, spawnPlayer, spawnSpectator} from "./utils/spawns.js"
import {Gimbal, Humanoid, Parent, Position, Spawner, SpawnTracker, Spectator} from "../components/plain_components.js"

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

				mark(buttons.bot_spawn.onPressed(() => {
					entity.components.spawner.inputs.bot_spawn = true
				}))

				mark(buttons.bot_delete.onPressed(() => {
					entity.components.spawner.inputs.bot_delete = true
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
						const isPlayer = player.has({Humanoid})
						const isSpectator = player.has({Spectator})

						if (player.has({Gimbal, Position})) {
							spawner.starting_at.gimbal = player.components.gimbal
							spawner.starting_at.position = player.components.position
						}

						player.dispose()

						if (isPlayer)
							spawnSpectator(world, spawner)
						else if (isSpectator)
							spawnPlayer(world, spawner)
					}
					else {
						spawnPlayer(world, spawner)
					}
				}

				if (spawner.inputs.bot_spawn) {
					const bot = world.create(Archetypes.bot({
						debug: false,
						gimbal: [0, 0],
						position: [0, 2, 5],
					}))
					spawner.bots.push(bot.id)
				}

				if (spawner.inputs.bot_delete) {
					const exists = new Set(world.obtain(spawner.bots).map(e => e.id))
					spawner.bots = spawner.bots.filter(id => exists.has(id))

					const botId = spawner.bots.shift()
					if (botId) {
						const bot = world.get(botId)
						bot.dispose()
					}
				}

				spawner.inputs = blank_spawner_state().inputs
			}),
	]
})

