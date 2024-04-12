
import {Trashcan} from "@benev/toolbox"

import {Archetypes} from "../archetypes.js"
import {system, behavior, responder} from "../hub.js"
import {Humanoid, Parent, Spawner, SpawnTracker, Spectator} from "../components/plain_components.js"
import {blank_spawner_state, spawnPlayer, spawnSpectator, updateStartingAt} from "./utils/spawns.js"

export const spawning = system("spawning", ({world, realm}) => {
	const spawnedQuery = world.query({SpawnTracker, Parent})

	function getSpawnTrackerEntity() {
		const [entity] = spawnedQuery.matches
		return entity
			? entity
			: undefined
	}

	function getAlreadySpawned() {
		const spawnTracker = getSpawnTrackerEntity()
		return spawnTracker
			? world.get(spawnTracker.components.parent)
			: null
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
				const {respawn, switch_to_player, switch_to_spectator} = spawner.inputs

				if (respawn) {
					const spawned = getAlreadySpawned()
					if (spawned) {
						const isHumanoid = spawned.has({Humanoid})
						updateStartingAt(spawner, spawned)
						spawned.dispose()
						if (isHumanoid) spawnSpectator(world, spawner)
						else spawnPlayer(world, spawner)
					}
					else {
						spawner.starting_at = blank_spawner_state().starting_at
						spawnPlayer(world, spawner)
					}
				}

				else if (switch_to_player) {
					const spawned = getAlreadySpawned()
					if (spawned && !spawned.has({Humanoid})) {
						updateStartingAt(spawner, spawned)
						spawned.dispose()
						spawnPlayer(world, spawner)
					}
				}

				else if (switch_to_spectator) {
					const spawned = getAlreadySpawned()
					if (spawned && !spawned.has({Spectator})) {
						updateStartingAt(spawner, spawned)
						spawned.dispose()
						spawnSpectator(world, spawner)
					}
				}
			}),

		behavior("bot spawns")
			.select({Spawner})
			.logic(() => ({components: {spawner}}) => {

				if (spawner.inputs.bot_spawn) {
					const bot = world.create(Archetypes.bot({
						debug: true,
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
			}),

		behavior("reset spawn inputs")
			.select({Spawner})
			.logic(() => ({components: {spawner}}) => {
				spawner.inputs = blank_spawner_state().inputs
			}),
	]
})

