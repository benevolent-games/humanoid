
import {Selectors} from "./selectors.js"
import {arch, params} from "./helpers.js"
import {Sensitivity} from "../schema/schema.js"
import {Vec3, quat, vec2, vec3} from "@benev/toolbox"

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
			maxZ: 2_500,
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
		gimbalRig: {},
	}))

	export const spectator = arch(Selectors.spectator, ({position}: {position: Vec3}) => ({
		...params(freecam({position})),
		force: vec2.zero(),
		impetus: vec3.zero(),
		position,
		spectator: {},
		smoothing: 5,
		speeds: {base: 5, fast: 40, slow: 1},
	}))

	export const humanoid = arch(Selectors.humanoid, ({debug, position}: {
			debug: boolean,
			position: Vec3,
		}) => ({
		...params(spectator({position})),
		debug,
		speeds: {base: 3, fast: 5, slow: 1.5},
		humanoidCapsule: {
			height: 1.75,
			radius: .2,
		},
		humanoidCameraRig: {
			height: 1.75,
			third_person_distance: 1,
		},
		stance: "stand",
		grounding: {
			grounded: true,
			seconds: 0,
		},
		airborneTrajectory: vec3.zero(),
		jump: false,
		previousPosition: position,
		velocity: vec3.zero(),
		character: {height: 1.75},
		choreography: {
			swivel: 0.5,
			settings: {
				swivel_duration: 20,
				swivel_readjustment_margin: .1,
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
	}))
}

