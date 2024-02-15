
import {select} from "./helpers.js"
import {Camera} from "../schema/hybrids/camera.js"
import {Gimbal} from "../schema/hybrids/gimbal.js"
import {Transform} from "../schema/hybrids/transform.js"
import {MouseAccumulator} from "../schema/hybrids/mouse_accumulator.js"
import {Controllable, Force, Impetus, Intent, Sensitivity, Smoothing, Spectator, Speeds} from "../schema/schema.js"

export namespace Selectors {
	export const freecam = select({
		Sensitivity,
		Transform,
		Camera,
		Controllable,
		MouseAccumulator,
		Intent,
		Force,
		Gimbal,
	})

	export const spectator = select({
		...freecam,
		Spectator,
		Impetus,
		Smoothing,
		Speeds,
	})
}

