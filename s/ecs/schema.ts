
import {HumanoidContainers} from "../models/realm/realm.js"
import {Ecs, Quat, Speeds, Vec2, Vec3} from "@benev/toolbox"
import {Choreography} from "./systems/choreography/calculations.js"

export type HumanoidTick = {
	tick: number
	deltaTime: number
}

export type HumanoidSchema = Ecs.AsSchema<{
	debug: boolean
	environment: keyof HumanoidContainers

	position: Vec3
	rotation: Quat
	scale: Vec3
	velocity: Vec3

	mesh: number

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

	physical: "dynamic" | "fixed"
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

export type ChoreographyComponent = Omit<Choreography, "gimbal" | "intent">

