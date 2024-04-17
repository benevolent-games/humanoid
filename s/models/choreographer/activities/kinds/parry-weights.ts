
import {scalar, spline} from "@benev/toolbox"
import {zeroWeights} from "../kit/zero-weights.js"
import {ParryReport} from "../../../activity/reports/parry.js"

export function parryWeights({progress}: ParryReport) {
	const weights = zeroWeights()
	const parry = spline.linear(progress, [
		[0.0, 0],
		[0.1, 1],
		[0.5, 1],
		[1.0, 0],
	])
	weights.parry = {progress, weight: parry}
	weights.active = parry
	weights.inactive = scalar.inverse(parry)
	return weights
}

