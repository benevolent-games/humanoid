
import {Vec2} from "@benev/toolbox"

export function invert_y_axis([x, y]: Vec2): Vec2 {
	return [x, y * -1]
}

