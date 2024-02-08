
import {archetype} from "./types.js"
import {Ref} from "../../models/realm/parts/ref_store.js"
import {Quat, Vec3, quat, vec2, vec3} from "@benev/toolbox"

export namespace Archetypes {
	export const std_sensitivity = archetype(() => ({
		sensitivity: {
			keys: 100 / 10_000,
			mouse: 5 / 10_000,
			stick: 100 / 10_000,
		},
	}))

	export const freecam = archetype(({position}: {
			position: Vec3
		}) => ({
		...std_sensitivity(),
		position,
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

	export const hemi = archetype(({direction, intensity}: {
			direction: Vec3
			intensity: number
		}) => ({
		light: "hemi",
		direction,
		intensity,
	}))

	export const spectator = archetype(({position}: {
			position: Vec3
		}) => ({
		...freecam({position}),
		force: vec2.zero(),
		impetus: vec3.zero(),
		spectator: {},
		smoothing: 5,
		speeds: {base: 20, fast: 50, slow: 5},
	}))

	export const humanoid = archetype(({debug, position}: {
			debug: boolean
			position: Vec3
		}) => ({
		...freecam({position}),
		humanoid: {},
		stance: "stand",
		debug,
		third_person_cam_distance: 1.5,
		height: 1.75,
		mass: 70,
		radius: .2,
		smoothing: 4,
		rotation: quat.identity(),
		velocity: vec3.zero(),
		speeds: {base: 3, fast: 5, slow: 1.5},
		grounding: {
			grounded: false,
			seconds: 0,
		},
		impetus: vec3.zero(),
		airborne_trajectory: vec3.zero(),
		jump: false,
		attackage: {
			attack: 0,
			seconds: 0,
		},
		ambulatory: {
			magnitude: 0,
			groundage: 0,
			standing: 1,
			north: 0,
			south: 0,
			west: 0,
			east: 0,
		},
		choreography: {
			swivel: .5,
			adjustment: null,
			settings: {
				swivel_readjustment_margin: .1,
				swivel_duration: 20,
			},
		},
	}))

	export const bot = archetype(({debug, position}: {
			debug: boolean
			position: Vec3
		}) => ({
		humanoid: {},
		position,
		force: vec2.zero(),
		gimbal: [0, 0.5],

		stance: "stand",
		debug,
		third_person_cam_distance: 1.5,
		height: 1.75,
		mass: 70,
		radius: .2,
		smoothing: 4,
		rotation: quat.identity(),
		velocity: vec3.zero(),
		speeds: {base: 3, fast: 5, slow: 1.5},
		grounding: {
			grounded: false,
			seconds: 0,
		},
		impetus: vec3.zero(),
		airborne_trajectory: vec3.zero(),
		jump: false,
		attackage: {
			attack: 0,
			seconds: 0,
		},
		intent: {
			amble: vec2.zero(),
			glance: vec2.zero(),
			fast: false,
			slow: false,
			jump: false,
			attack: false,
		},
		ambulatory: {
			magnitude: 0,
			groundage: 0,
			standing: 1,
			north: 0,
			south: 0,
			west: 0,
			east: 0,
		},
		choreography: {
			swivel: .5,
			adjustment: null,
			settings: {
				swivel_readjustment_margin: .1,
				swivel_duration: 20,
			},
		},
	}))

	export const physicsBox = archetype(({
			debug,
			density,
			position,
			rotation,
			scale,
			damping_linear = 0,
			damping_angular = 0,
			child_prop_refs = [],
		}: {
			debug: boolean
			scale: Vec3
			position: Vec3
			rotation: Quat
			density: number
			damping_linear?: number
			damping_angular?: number
			child_prop_refs?: Ref[]
		}) => ({
		debug,
		physical_dynamic: {},
		shape: "box",
		density,
		position,
		rotation,
		scale,
		damping_linear,
		damping_angular,
		child_prop_refs,
	}))
}

