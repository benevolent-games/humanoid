
import {Vec3, vec2, vec3} from "@benev/toolbox"
import {Selectors} from "./selectors.js"
import {arch, params} from "./helpers.js"
import {Sensitivity} from "../schema/schema.js"

export namespace Archetypes {

	export const sensitivity = arch({Sensitivity}, () => ({
		sensitivity: {
			keys: 100 / 10_000,
			mouse: 5 / 10_000,
			stick: 100 / 10_000,
		},
	}))

	export const freecam = arch(Selectors.freecam, ({position}: {position: Vec3}) => ({
		...params(sensitivity()),
		position,
		transform: {},
		mouseAccumulator: {},
		camera: {
			fov: 90,
			minZ: 0.1,
			maxZ: 1_000,
		},
		controllable: {},
		intent: {
			amble: vec2.zero(),
			glance: vec2.zero(),
			fast: false,
			slow: false,
			jump: false,
			attack: false,
		},
		gimbal: [0, 0.5],
	}))

	export const spectator = arch(Selectors.spectator, ({position}: {position: Vec3}) => ({
		...params(freecam({position})),
		force: vec2.zero(),
		impetus: vec3.zero(),
		position,
		spectator: {},
		smoothing: 5,
		speeds: {base: 20, fast: 50, slow: 5},
	}))

	// export const spectator2 = hub.archetype(world => ({position}: {
	// 		position: Vec3
	// 	}) => {

	// 	const camera = world.createEntity({Camera}, {
	// 		camera: {
	// 			fov: 90,
	// 			minZ: 0.1,
	// 			maxZ: 1_000,
	// 		},
	// 	})

	// 	const transformB = world.createEntity({Transform, Children}, {
	// 		transform: {},
	// 		children: [camera.id],
	// 	})

	// 	const transformA = world.createEntity({
	// 			Transform,
	// 			Children,
	// 		}, {
	// 		transform: {},
	// 		children: [transformB.id],
	// 	})
	// })
}

