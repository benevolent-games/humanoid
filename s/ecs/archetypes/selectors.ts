
import {select} from "./helpers.js"
import {Camera} from "../schema/hybrids/camera.js"
import {Transform} from "../schema/hybrids/transform.js"
import {GimbalRig} from "../schema/hybrids/gimbal_rig.js"
import {MouseAccumulator} from "../schema/hybrids/mouse_accumulator.js"
import {Controllable, Force, Gimbal, Impetus, Intent, Position, Sensitivity, Smoothing, Spectator, Speeds} from "../schema/schema.js"

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
}

