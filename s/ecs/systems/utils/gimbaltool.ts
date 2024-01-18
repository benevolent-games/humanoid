
import {Vec2, Vec3, scalar, vec2} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

const circle: Vec2 = [
	scalar.radians.from.degrees(0),
	scalar.radians.from.degrees(360),
]

export const gimbaltool = (gimbal: Vec2) => ({

	rotate([moveX, moveY, moveZ]: Vec3): Vec3 {
		const [gimbalX] = gimbal
		const [x, z] = vec2.rotate(
			[moveX, moveZ],
			-scalar.map(gimbalX, circle),
		)
		return [x, moveY, z]
	},

	unrotate([moveX, moveY, moveZ]: Vec3): Vec3 {
		const [gimbalX] = gimbal
		const [x, z] = vec2.rotate(
			[moveX, moveZ],
			scalar.map(gimbalX, circle),
		)
		return [x, moveY, z]
	},

	quaternions() {
		const [x, y] = gimbal
		const yaw = scalar.radians.from.circle(x)
		const pitch = scalar.map(y, [
			scalar.radians.from.degrees(90),
			scalar.radians.from.degrees(-90),
		])
		return {
			horizontal: Quaternion.FromEulerAngles(0, yaw, 0),
			vertical: Quaternion.FromEulerAngles(pitch, 0, 0),
		}
	},
})

