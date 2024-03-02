
import {Vec2, Vec3, vec2} from "@benev/toolbox"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export const gimbaltool = (gimbal: Vec2) => ({

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
})

