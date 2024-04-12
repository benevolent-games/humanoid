
import {Vec2, Vec3, vec2} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export const gimbaltool = (gimbal: Vec2) => ({

	rotate([x, y, z]: Vec3): Vec3 {
		const [xRadians, yRadians] = gimbal
		const cosX = Math.cos(xRadians)
		const cosY = Math.cos(yRadians)
		const sinX = Math.sin(xRadians)
		const sinY = Math.sin(yRadians)

		// Rotate around the X-axis (pitch)
		let x1 = x
		let y1 = y * cosX - z * sinX
		let z1 = y * sinX + z * cosX

		// Rotate around the Y-axis (yaw)
		let x2 = x1 * cosY + z1 * sinY
		let y2 = y1
		let z2 = -x1 * sinY + z1 * cosY

		return [x2, y2, z2]
	},

	quaternions() {
		const [x, y] = gimbal
		const yaw = -x
		const pitch = -y
		return {
			horizontal: Quaternion.FromEulerAngles(0, yaw, 0),
			vertical: Quaternion.FromEulerAngles(pitch, 0, 0),
			combined: Quaternion.FromEulerAngles(pitch, yaw, 0),
		}
	},

	flat: {
		rotate2d(vec: Vec2): Vec2 {
			const [gimbalX] = gimbal
			return vec2.rotate(vec, gimbalX)
		},

		unrotate2d(vec: Vec2): Vec2 {
			const [gimbalX] = gimbal
			return vec2.rotate(vec, -gimbalX)
		},

		rotate([moveX, moveY, moveZ]: Vec3): Vec3 {
			const [gimbalX] = gimbal
			const [x, z] = vec2.rotate([moveX, moveZ], gimbalX)
			return [x, moveY, z]
		},

		unrotate([moveX, moveY, moveZ]: Vec3): Vec3 {
			const [gimbalX] = gimbal
			const [x, z] = vec2.rotate([moveX, moveZ], -gimbalX)
			return [x, moveY, z]
		},
	},
})

