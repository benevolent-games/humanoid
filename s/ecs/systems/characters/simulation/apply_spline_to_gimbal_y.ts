
import {Vec2, scalar} from "@benev/toolbox"

export function apply_spline_to_gimbal_y([x, y]: Vec2, spline: number[]): Vec2 {
	y = scalar.spline.quickLinear(y, spline)
	return [x, y]
}

