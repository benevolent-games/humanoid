
import {scalar, spline} from "@benev/toolbox"
import {zeroWeights} from "../kit/zero-weights.js"
import {EquipReport} from "../../../activity/reports/equip.js"

export function equipWeights({progress}: EquipReport) {
	const weights = zeroWeights()
	weights.progress = progress
	const active = spline.linear(progress, [
		[0.0, 0],
		[0.5, 1],
		[1.0, 0],
	])
	weights.equip = active
	weights.active = active
	weights.inactive = scalar.inverse(active)
	return weights
}

