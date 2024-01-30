
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
		intent: {
			amble: vec3.zero(),
			glance: vec2.zero(),
			fast: false,
			slow: false,
		},
		force: vec3.zero(),
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
		stance: "fly",
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
		radius: .3,
		smoothing: 4,
		rotation: quat.identity(),
		velocity: vec3.zero(),
		speeds: {base: 3, fast: 5, slow: 1.5},
		grounded: false,
		localForce: vec3.zero(),
		jump: {
			button: false,
			cooldown: 30,
			tick: 0,
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

