
import {select} from "./helpers.js"
import {Camera} from "../schema/hybrids/camera.js"
import {Capsule} from "../schema/hybrids/capsule.js"
import {Transform} from "../schema/hybrids/transform.js"
import {GimbalRig} from "../schema/hybrids/gimbal_rig.js"
import {CameraRig} from "../schema/hybrids/camera_rig.js"
import {Character} from "../schema/hybrids/character/character.js"
import {MouseAccumulator} from "../schema/hybrids/mouse_accumulator.js"
import {AirborneTrajectory, Ambulation, Attackage, Choreography, Controllable, Debug, Force, Gimbal, Grounding, Impetus, Intent, Jump, Perspective, Position, CoolGimbal, PreviousPosition, Rotation, Sensitivity, Smoothing, Spectator, Speeds, Stance, Velocity, Orbit} from "../schema/schema.js"

export namespace Selectors {
	export const freecam = select({
		Sensitivity,
		Transform,
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

	export const humanoid = select({
		...freecam,
		Debug,

		Force,
		Impetus,
		Position,
		Smoothing,
		Speeds,

		Capsule,
		CameraRig,
		Perspective,
		Stance,
		Grounding,
		AirborneTrajectory,
		Jump,

		PreviousPosition,
		Velocity,
		CoolGimbal,
		Orbit,

		Character,
		Choreography,
		Ambulation,
		Rotation,
		Attackage,
	})
}

