
import {spline} from "@benev/toolbox"
import {zeroWeights} from "../utils/zero-weights.js"
import {EquipReport} from "../../../activity/reports/equip.js"

export function equipWeights({progress}: EquipReport) {
	const weights = zeroWeights()
	const active = spline.linear(progress, [
		[0.0, 0],
		[0.5, 1],
		[1.0, 0],
	])
	weights.equip = {weight: active, progress}
	weights.active = active
	return weights
}

