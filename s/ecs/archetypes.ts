
import {Ecs, Vec2, Vec3, quat, scalar, vec2, vec3} from "@benev/toolbox"

import {Archetype} from "./hub.js"
import {Camera} from "./schema/hybrids/camera.js"
import {Capsule} from "./schema/hybrids/capsule.js"
import {GimbalRig} from "./schema/hybrids/gimbal_rig.js"
import {CameraRig} from "./schema/hybrids/camera_rig.js"
import {Tracer} from "./schema/hybrids/tracer/tracer.js"
import {Character} from "./schema/hybrids/character/character.js"
import {MouseAccumulator} from "./schema/hybrids/mouse_accumulator.js"
import {LookpadAccumulator} from "./schema/hybrids/lookpad_accumulator.js"
import {Ai, AirborneTrajectory, Ambulation, Bot, Choreography, Controllable, CoolGimbal, Debug, Force, Gimbal, Grounding, Health, Humanoid, Impetus, Intent, Jump, MeleeAction, MeleeAim, MeleeIntent, MeleeWeapon, Orbit, Perspective, Position, PreviousPosition, Rotation, Seed, Smoothing, Spectator, Speeds, Stance, Velocity} from "./schema/schema.js"

type Options<Fn extends ((...p: any[]) => any)> = (
	Parameters<Fn>[0]
)

const camera = () => ({
	fov: 90,
	minZ: 0.12,
	maxZ: 15_000,
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
			Smoothing,
			Speeds,

			Capsule,
			Stance,
			Grounding,
			AirborneTrajectory,
			Jump,

			PreviousPosition,
			Velocity,
			CoolGimbal,

			Perspective,
			Character,
			Choreography,
			Ambulation,
			Rotation,

			MeleeAim,
			MeleeIntent,
			MeleeWeapon,
			MeleeAction,
			Tracer,

			Health,
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
			smoothing: 5,

			speeds: {base: 2.75, fast: 4.75, slow: 1.5},
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
			coolGimbal: {gimbal: o.gimbal, records: [o.gimbal]},
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
			health: 1,
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

