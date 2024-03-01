
import {Selectors} from "./selectors.js"
import {arch, params} from "./helpers.js"
import {Sensitivity} from "../schema/schema.js"
import {Vec2, Vec3, quat, vec2, vec3} from "@benev/toolbox"

export namespace Archetypes {
	export const sensitivity = arch({Sensitivity}, () => ({
		sensitivity: {
			keys: 100 / 10_000,
			mouse: 5 / 10_000,
			stick: 100 / 10_000,
		},
	}))

	export const freecam = arch(Selectors.freecam, ({position, gimbal}: {position: Vec3, gimbal: Vec2}) => ({
		...params(sensitivity()),
		position,
		transform: {},
		mouseAccumulator: {},
		camera: {
			fov: 90,
			minZ: 0.1,
			maxZ: 15_000,
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
		gimbal,
	}))

	export const spectator = arch(Selectors.spectator, ({position, gimbal}: {position: Vec3, gimbal: Vec2}) => ({
		...params(freecam({position, gimbal})),
		force: vec2.zero(),
		impetus: vec3.zero(),
		position,
		spectator: {},
		smoothing: 5,
		speeds: {base: 5, fast: 40, slow: 1},
		gimbalRig: {},
	}))

	export const humanoid = arch(Selectors.humanoid, ({debug, position, gimbal}: {
			debug: boolean,
			position: Vec3,
			gimbal: Vec2,
		}) => ({
		...params(spectator({position, gimbal})),
		debug,
		speeds: {base: 3, fast: 5, slow: 1.5},
		capsule: {
			height: 1.75,
			radius: .2,
		},
		cameraRig: {
			height: 1.75,
			third_person_distance: 1,
		},
		perspective: "third_person",
		camera: {
			fov: 100,
			minZ: 0.1,
			maxZ: 15_000,
		},
		stance: "stand",
		grounding: {
			grounded: true,
			seconds: 0,
		},
		airborneTrajectory: vec3.zero(),
		jump: false,
		previousPosition: position,
		coolGimbal: {gimbal, records: [gimbal]},
		velocity: vec3.zero(),
		character: {height: 1.75},
		choreography: {
			swivel: 0.5,
			settings: {
				swivel_duration: 20,
				swivel_readjustment_margin: .2,
			},
			adjustment: null,
		},
		ambulation: {
			magnitude: 0,
			groundage: 0,
			standing: 1,
			north: 0,
			south: 0,
			west: 0,
			east: 0,
			smooth: {
				standing: 1,
				groundage: 0,
				normal: vec2.zero(),
				globalvel: vec2.zero(),
			},
		},
		rotation: quat.identity(),
		attackage: {
			seconds: 0,
			attack: 0,
		},
		orbit: null,
	}))
}

