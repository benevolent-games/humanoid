
import {Vec2, Vec3} from "@benev/toolbox"

/** discard y axis. */
export function flatten([x,,z]: Vec3): Vec2 {
	return [x, z]
}

