
import {Ecs3, Quat, Speeds, Vec2, Vec3} from "@benev/toolbox"

import {Ref} from "../models/realm/parts/ref_store.js"
import {Choreography} from "../models/choreographer/types.js"

export type HumanoidTick = {
	tick: number
	deltaTime: number
}

export type HumanoidSchema = Ecs3.AsSchema<{
	debug: boolean
	environment: "gym"

	position: Vec3
	rotation: Quat
	scale: Vec3
	velocity: Vec3

	mesh: Ref
	prop: Ref

	light: "hemi"
	density: number
	mass: number
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

	physical: "dynamic" | "fixed" | "fixture"
	physics_rigid: Ref
	joint: {
		parts: [Ecs3.Id, Ecs3.Id]
		anchors: [Vec3, Vec3]
	}
	shape: "box"

	intent: {
		amble: Vec3
		glance: Vec2
		fast: boolean
		slow: boolean
	}
	smoothing: number
	force: Vec3
	gimbal: Vec2

	choreography: Choreography

	speeds: Speeds
	sensitivity: {
		keys: number
		mouse: number
		stick: number
	}

	spectator: {}
	humanoid: {}
}>

