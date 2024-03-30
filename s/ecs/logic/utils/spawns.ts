
import {World, arch} from "../../hub.js"
import {Relations} from "./relations.js"
import {Ecs, vec2, vec3} from "@benev/toolbox"
import {Archetypes} from "../../archetypes.js"
import {SpawnTracker, Spawner} from "../../schema/schema.js"

export function blank_spawner_state(): Ecs.ComponentState<Spawner> {
	return {
		bots: [],
		starting_at: {
			gimbal: vec2.zero(),
			position: [0, 5, 0],
		},
		inputs: {
			respawn: false,
			bot_spawn: false,
			bot_delete: false,
			switch_to_player: false,
			switch_to_spectator: false,
		},
	}
}

export function spawnPlayer(
		world: World,
		spawner: Ecs.ComponentState<Spawner>,
	) {

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
	return {player, spawnTracker}
}

export function spawnSpectator(
		world: World,
		spawner: Ecs.ComponentState<Spawner>,
	) {

	const spectator = world.create(Archetypes.spectator({
		gimbal: spawner.starting_at.gimbal,
		position: vec3.add(spawner.starting_at.position, [0, 0, 0]),
	}))

	const spawnTracker = world.create(
		arch({SpawnTracker}, {spawnTracker: {}})
	)

	Relations.parent(world, spectator, spawnTracker)
	return {spectator, spawnTracker}
}

