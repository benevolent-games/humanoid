
import {Vec2, scalar} from "@benev/toolbox"

import {Ambulatory} from "../../../types.js"
import {molasses} from "../../../../../tools/molasses.js"
import {halfcircle} from "../../../../../tools/halfcircle.js"
import {AdjustmentAnims, ChoreoSwivelAdjustment, Choreo} from "../../../../../models/choreographer/types.js"

export const swivel_midpoint = 0

export function swivel_effected_by_glance(swivel: number, [x]: Vec2) {
	return scalar.clamp(swivel + (x * 1), ...halfcircle)
}

export function apply_adjustments(
		adjustment_anims: AdjustmentAnims,
		ambulatory: Ambulatory,
		choreo: Choreo,
		smoothing: number,
	) {

	const {adjustment, settings} = choreo
	const character_is_ambulating = ambulatory.magnitude > 0.1

	if (adjustment) {
		const speed = 1 / adjustment.duration
		adjustment.progress += speed

		choreo.swivel = calculate_adjustment_swivel(adjustment)
		adjustment_anims.update(adjustment)

		if (adjustment.progress >= 1) {
			adjustment_anims.stop(adjustment)
			choreo.adjustment = null
		}
	}
	else {
		if (character_is_ambulating) {
			choreo.swivel = molasses(smoothing, choreo.swivel, swivel_midpoint)
		}
		else if (adjustment_is_needed(choreo.swivel, settings.swivel_readjustment_margin)) {
			choreo.adjustment = {
				progress: 0,
				initial_swivel: choreo.swivel,
				duration: settings.swivel_duration,
				direction: choreo.swivel < swivel_midpoint
					? "left"
					: "right",
			}
			adjustment_anims.start(choreo.adjustment)
		}
	}

	choreo.swivel = scalar.clamp(choreo.swivel, ...halfcircle)
}

export function adjustment_is_needed(swivel: number, margin: number) {
	return !scalar.within(
		swivel,
		scalar.radians.from.degrees(-90) + margin,
		scalar.radians.from.degrees(90) - margin,
	)
}

function calculate_adjustment_swivel(adjustment: ChoreoSwivelAdjustment) {
	return scalar.map(adjustment.progress, [
		adjustment.initial_swivel,
		swivel_midpoint,
	])
}

