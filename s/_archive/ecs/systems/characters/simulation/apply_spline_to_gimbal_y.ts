
import {Vec2, spline} from "@benev/toolbox"

export function apply_spline_to_gimbal_y([x, y]: Vec2, points: number[]): Vec2 {
	y = spline.ez.linear(y, points)
	return [x, y]
}

