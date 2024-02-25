
import {select} from "./helpers.js"
import {Camera} from "../schema/hybrids/camera.js"
import {Transform} from "../schema/hybrids/transform.js"
import {GimbalRig} from "../schema/hybrids/gimbal_rig.js"
import {MouseAccumulator} from "../schema/hybrids/mouse_accumulator.js"
import {AirborneTrajectory, Controllable, Force, Gimbal, Grounding, Impetus, Intent, Jump, Position, PreviousPosition, Sensitivity, Smoothing, Spectator, Speeds, Stance, Velocity} from "../schema/schema.js"
import {HumanoidCapsule} from "../schema/hybrids/humanoid_capsule.js"
import {HumanoidCameraRig} from "../schema/hybrids/humanoid_camera_rig.js"

export namespace Selectors {
	export const freecam = select({
		Sensitivity,
		Transform,
		Camera,
		Controllable,
		MouseAccumulator,
		Intent,
		Gimbal,
		GimbalRig,
	})

	export const spectator = select({
		...freecam,
		Spectator,
		Force,
		Impetus,
		Position,
		Smoothing,
		Speeds,
	})

	export const humanoid = select({
		...freecam,
		Force,
		Impetus,
		Position,
		Smoothing,
		Speeds,

		HumanoidCapsule,
		HumanoidCameraRig,
		Stance,
		Grounding,
		AirborneTrajectory,
		Jump,
		PreviousPosition,

		Velocity,
	})
}

