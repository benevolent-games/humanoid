
import {Selectors} from "./selectors.js"
import {arch, params} from "./helpers.js"
import {Perspective} from "../schema/schema.js"
import {CState, Vec2, Vec3, quat, scalar, vec2, vec3} from "@benev/toolbox"

export namespace Archetypes {
	export const freecam = arch(Selectors.freecam, ({position, gimbal}: {position: Vec3, gimbal: Vec2}) => ({
		position,
		transform: {},
		mouseAccumulator: {},
		camera: {
			fov: 90,
			minZ: 0.12,
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

	export const biped = arch(Selectors.biped, ({
			debug,
			position,
			gimbal,
		}) => ({
		debug,

		position,
		gimbal,

		cameraRig: {
			height: 1.75,
			third_person_distance: 1,
		},
		mouseAccumulator: {},
		intent: {
			amble: vec2.zero(),
			glance: vec2.zero(),
			fast: false,
			slow: false,
			jump: false,
			attack: false,
		},
		orbit: null,

		force: vec2.zero(),
		impetus: vec3.zero(),
		smoothing: 5,

		speeds: {base: 3, fast: 6, slow: 1.5},
		capsule: {
			height: 1.75,
			radius: .2,
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
		perspective: "third_person",
		character: {height: 1.75},
		choreography: {
			swivel: 0,
			settings: {
				swivel_duration: 40,
				swivel_readjustment_margin: scalar.radians.from.degrees(10),
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
		meleeAim: {
			smoothedGlanceNormal: [1, 0],
			lastGlanceNormal: [1, 0],
			angle: scalar.radians.from.degrees(90),
		},
		meleeIntent: {
			parry: false,
			stab: false,
			swing: false,
		},
		meleeWeapon: "longsword",
		meleeAction: null,
		tracer: {lines: [[[0, 0, 0], [0, 1, 0]]]},
	}))

	export const humanoid = arch(Selectors.humanoid, ({debug, position, gimbal, perspective}: {
			debug: boolean,
			position: Vec3,
			gimbal: Vec2,
			perspective: CState<Perspective>
		}) => ({
		...params(biped({debug, position, gimbal})),
		controllable: {},
		camera: {
			fov: 90,
			minZ: 0.12,
			maxZ: 15_000,
		},
		perspective,
	}))

	export const bot = arch(Selectors.bot, ({debug, position, gimbal}: {
			debug: boolean,
			position: Vec3,
			gimbal: Vec2,
		}) => ({
		...params(biped({debug, position, gimbal})),
		bot: {},
	}))
}

