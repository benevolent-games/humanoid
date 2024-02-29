
import {Vec2, Vec3, scalar, vec2} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export const gimbaltool = (gimbal: Vec2) => ({

	rotate2d(vec: Vec2): Vec2 {
		const [gimbalX] = gimbal
		return vec2.rotate(vec, scalar.radians.from.circle(gimbalX))
	},

	unrotate2d(vec: Vec2): Vec2 {
		const [gimbalX] = gimbal
		return vec2.rotate(vec, -scalar.radians.from.circle(gimbalX))
	},

	rotate([moveX, moveY, moveZ]: Vec3): Vec3 {
		const [gimbalX] = gimbal
		const [x, z] = vec2.rotate(
			[moveX, moveZ],
			scalar.radians.from.circle(gimbalX),
		)
		return [x, moveY, z]
	},

	unrotate([moveX, moveY, moveZ]: Vec3): Vec3 {
		const [gimbalX] = gimbal
		const [x, z] = vec2.rotate(
			[moveX, moveZ],
			-scalar.radians.from.circle(gimbalX),
		)
		return [x, moveY, z]
	},

	quaternions() {
		const [x, y] = gimbal
		const yaw = -scalar.radians.from.circle(x)
		const pitch = -scalar.map(y, [
			scalar.radians.from.degrees(-90),
			scalar.radians.from.degrees(90),
		])
		return {
			horizontal: Quaternion.FromEulerAngles(0, yaw, 0),
			vertical: Quaternion.FromEulerAngles(pitch, 0, 0),
			combined: Quaternion.FromEulerAngles(pitch, yaw, 0),
		}
	},
})

