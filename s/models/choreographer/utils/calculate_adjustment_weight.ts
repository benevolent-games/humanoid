
import {spline} from "@benev/toolbox"

export function calculate_adjustment_weight(progress: number) {
	return spline.ez.linear(progress, [0, 1, 1, 0])
}

