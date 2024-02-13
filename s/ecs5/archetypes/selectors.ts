
import {select} from "./helpers.js"
import {Camera} from "../schema/hybrids/camera.js"
import {Spectator} from "../schema/hybrids/spectator.js"
import {Transform} from "../schema/hybrids/transform.js"
import {MouseAccumulator} from "../schema/hybrids/mouse_accumulator.js"
import {Controllable, Force, Gimbal, Impetus, Intent, Sensitivity, Smoothing, Speeds} from "../schema/schema.js"

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

