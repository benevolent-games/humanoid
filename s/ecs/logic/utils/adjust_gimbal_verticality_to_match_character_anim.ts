
import {Vec2, scalar, spline} from "@benev/toolbox"

const {degrees} = scalar.radians.from

const points = [
	[degrees(-90), degrees(-90)] as Vec2,
	[degrees(0), degrees(0)] as Vec2,
	[degrees(90), degrees(70)] as Vec2,
]

export function adjust_gimbal_verticality_to_match_character_anim([x, y]: Vec2): Vec2 {
	y = spline.linear(y, points)
	return [x, y]
}

