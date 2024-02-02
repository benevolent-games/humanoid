
import {Ecs4, Quat, Speeds, Vec2, Vec3} from "@benev/toolbox"

import {Ref} from "../models/realm/parts/ref_store.js"
import {Choreography} from "../models/choreographer/types.js"

export type HumanoidTick = {
	tick: number
	deltaSeconds: number
}

export type HumanoidSchema = Ecs4.AsSchema<{
	debug: boolean
	environment: "gym"
	sky: {
		size: number
		rotation: number
	}

	position: Vec3
	rotation: Quat
	scale: Vec3

	// actual measured velocity
	velocity: Vec3

	prop_ref: Ref
	child_prop_refs: Ref[]
	physics_rigid_ref: Ref

	light: "hemi"
	density: number
	mass: number
	damping_linear: number
	damping_angular: number
	height: number
	radius: number
	direction: Vec3
	intensity: number
	third_person_cam_distance: number
	camera: {
		fov: number
		minZ: number
		maxZ: number
	}

	physical_dynamic: {}
	physical_static: {}
	physical_fixture: {}
	joint: {
		parts: [Ecs4.Id, Ecs4.Id]
		anchors: [Vec3, Vec3]
	}
	shape: "box"

	controllable: {}
	intent: {
		amble: Vec2
		glance: Vec2
		fast: boolean
		slow: boolean
	}

	// smoothed amble
	force: Vec2

	// will be applied as velocity
	impetus: Vec3

	// rotational qualities
	gimbal: Vec2

	jump: {
		button: boolean
		tick: number
		cooldown: number
	}
	grounded: boolean
	smoothing: number

	choreography: Choreography
	stance: "stand" | "crouch"

	speeds: Speeds
	sensitivity: {
		keys: number
		mouse: number
		stick: number
	}

	spectator: {}
	humanoid: {}
}>

