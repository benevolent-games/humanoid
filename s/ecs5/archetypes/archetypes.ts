
import {Vec3, vec2, vec3} from "@benev/toolbox"
import {Selectors} from "./selectors.js"
import {arch, params} from "./helpers.js"
import {Children, Sensitivity} from "../schema/schema.js"
import { hub } from "../hub.js"
import { Transform } from "../schema/hybrids/transform.js"
import { Camera } from "../schema/hybrids/camera.js"

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
		force: vec2.zero(),
		gimbal: [0, 0.5],
	}))

	export const spectator = arch(Selectors.spectator, ({position}: {position: Vec3}) => ({
		...params(freecam({position})),
		force: vec2.zero(),
		impetus: vec3.zero(),
		spectator: {},
		smoothing: 5,
		speeds: {base: 20, fast: 50, slow: 5},
	}))

	export const spectator2 = hub.archetype(world => ({position}: {
			position: Vec3
		}) => {

		const [cameraId, camera] = world.create({Camera}, {
			camera: {
				fov: 90,
				minZ: 0.1,
				maxZ: 1_000,
			},
		})

		const [transformBId, transformB] = world.create({Transform, Children}, {
			transform: {},
			children: [cameraId],
		})

		const transformA = world.create({Transform, Children}, {
			transform: {},
			children: [transformBId],
		})
	})
}

