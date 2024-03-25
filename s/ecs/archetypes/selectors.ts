
import {select} from "./helpers.js"
import {Camera} from "../schema/hybrids/camera.js"
import {Capsule} from "../schema/hybrids/capsule.js"
import {Tracer} from "../schema/hybrids/tracer/tracer.js"
import {GimbalRig} from "../schema/hybrids/gimbal_rig.js"
import {CameraRig} from "../schema/hybrids/camera_rig.js"
import {Character} from "../schema/hybrids/character/character.js"
import {MouseAccumulator} from "../schema/hybrids/mouse_accumulator.js"
import {AirborneTrajectory, Ambulation, Choreography, Controllable, Debug, Force, Gimbal, Grounding, Impetus, Intent, Jump, Perspective, Position, CoolGimbal, PreviousPosition, Rotation, Smoothing, Spectator, Speeds, Stance, Velocity, Orbit, MeleeAim, MeleeIntent, MeleeWeapon, MeleeAction, Bot} from "../schema/schema.js"

export namespace Selectors {
	export const freecam = select({
		Camera,
		Controllable,
		MouseAccumulator,
		Intent,
		Gimbal,
	})

	export const spectator = select({
		...freecam,
		Spectator,
		Force,
		Impetus,
		Position,
		Smoothing,
		Speeds,
		GimbalRig,
	})

	export const biped = select({
		Debug,

		CameraRig,
		MouseAccumulator,
		Intent,
		Gimbal,
		Orbit,

		Force,
		Impetus,
		Position,
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
	})

	export const humanoid = select({
		...biped,
		Camera,
		Controllable,
	})

	export const bot = select({
		...biped,
		Bot,
	})
}

