
import {Ecs, Vec2, Vec3, quat, scalar, vec2, vec3} from "@benev/toolbox"

import {Archetype} from "./hub.js"
import {Weapon} from "../models/armory/weapon.js"
import {Camera} from "./components/hybrids/camera.js"
import {Tracers} from "./components/hybrids/tracers.js"
import {Capsule} from "./components/hybrids/capsule.js"
import {GimbalRig} from "./components/hybrids/gimbal_rig.js"
import {CameraRig} from "./components/hybrids/camera_rig.js"
import {Character} from "./components/hybrids/character/character.js"
import {MouseAccumulator} from "./components/hybrids/mouse_accumulator.js"
import {LookpadAccumulator} from "./components/hybrids/lookpad_accumulator.js"
import {ActivityComponent, Health, Inventory, MeleeAim, MeleeIntent, NextActivity, ProtectiveBubble, Stamina} from "./components/topics/warrior.js"
import {Ai, AirborneTrajectory, Ambulation, Bot, Choreography, Controllable, GimbalSway, Debug, Force, Gimbal, Grounding, Humanoid, Impetus, Intent, Jump, Orbit, Perspective, Position, PreviousPosition, Rotation, Seed, Smoothing, Spectator, Speeds, Stance, Velocity, IsSprinting} from "./components/plain_components.js"

type Options<Fn extends ((...p: any[]) => any)> = (
	Parameters<Fn>[0]
)

// const camera = () => ({
// 	fov: 90,
// 	minZ: 0.12,
// 	maxZ: 15_000,
// })

const camera = () => ({
	fov: 90,
	minZ: 0.02,
	maxZ: 1_000,
})

export namespace Archetypes {
	export const freecam = (o: {
			position: Vec3,
			gimbal: Vec2,
		}) => new Archetype(
		{
			Position,
			MouseAccumulator,
			LookpadAccumulator,
			Intent,
			Gimbal,
		},
		{
			position: o.position,
			gimbal: o.gimbal,
			mouseAccumulator: {},
			lookpadAccumulator: {},
			intent: {
				amble: vec2.zero(),
				glance: vec2.zero(),
				fast: false,
				slow: false,
				jump: false,
			},
		}
	)

	export const spectator = (o: Options<typeof freecam>) => freecam(o).extend(
		{
			Spectator,
			Controllable,
			Camera,
			Force,
			Impetus,
			Smoothing,
			Speeds,
			GimbalRig,
		},
		{
			spectator: {},
			controllable: {},
			camera: camera(),
			force: vec2.zero(),
			impetus: vec3.zero(),
			smoothing: 5,
			speeds: {base: 5, fast: 40, slow: 1},
			gimbalRig: {},
		},
	)

	export const biped = (o: {
			debug: boolean
		} & Options<typeof freecam>) => freecam(o).extend(
		{
			Humanoid,
			Debug,

			CameraRig,
			Orbit,

			Force,
			Impetus,
			IsSprinting,
			Smoothing,
			Speeds,

			Capsule,
			Stance,
			Grounding,
			AirborneTrajectory,
			Jump,

			PreviousPosition,
			Velocity,
			GimbalSway,

			Perspective,
			Character,
			Choreography,
			Ambulation,
			Rotation,

			Health,
			Stamina,
			Inventory,
			ActivityComponent,
			NextActivity,
			MeleeAim,
			MeleeIntent,
			Tracers,
			ProtectiveBubble,
		},
		{
			humanoid: {},
			debug: o.debug,

			cameraRig: {
				height: 1.75,
				third_person_distance: 1,
			},
			orbit: null,

			force: vec2.zero(),
			impetus: vec3.zero(),
			isSprinting: false,
			smoothing: 5,

			speeds: {base: 2.3, fast: 4, slow: 1},
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
			previousPosition: o.position,
			gimbalSway: {gimbal: o.gimbal, records: [o.gimbal]},
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
			activityComponent: null,
			nextActivity: null,
			meleeAim: {
				smoothedGlanceNormal: [1, 0],
				lastGlanceNormal: [1, 0],
				angle: scalar.radians.from.degrees(90),
			},
			meleeIntent: {
				swing: false,
				stab: false,
				parry: false,
				feint: false,
				nextWeapon: false,
				previousWeapon: false,
				toggleShield: false,
				changeGrip: false,
			},
			inventory: {
				hands: {
					shield: true,
					grip: "onehander",
					equippedBeltSlot: Weapon.listing.indexOf(Weapon.library.hatchet),
				},
				belt: {
					slots: Weapon.listing,
				},
			},
			tracers: {},
			health: {
				hp: 1,
				bleed: 0,
			},
			stamina: {
				juice: 1,
				interruptionGametime: 0,
				knownMeleeAction: null,
			},
			protectiveBubble: {
				active: false,
				size: 0,
			},
		},
	)

	export const humanoid = (o: {
			perspective: Ecs.ComponentState<Perspective>
		} & Options<typeof biped>) => biped(o).extend(
		{Perspective, Camera, Controllable},
		{
			perspective: o.perspective,
			controllable: {},
			camera: camera(),
		},
	)

	export const bot = (o: {} & Options<typeof biped>) => biped(o).extend(
		{Bot, Ai, Seed},
		{
			bot: {},
			ai: {},
			seed: Math.random(),
		},
	)
}

