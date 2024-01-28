
import {Vec2, Vec3, babylonian, scalar} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {molasses, molasses3d} from "../utils/molasses.js"
import {create_humanoid_babylon_parts} from "./simulation/create_humanoid_babylon_parts.js"

export const humanoid = system("characters", () => [

	behavior("create and simulate humanoid capsule")
		.select(
			"humanoid",
			"debug",
			"third_person_cam_distance",
			"camera",
			"radius",
			"height",
			"smoothing",
			"position",
			"rotation",
			"gimbal",
			"force",
		)
		.lifecycle(realm => init => {
			const {
				transform,
				torusRoot,
				capsule,
			} = create_humanoid_babylon_parts(realm, init)

			let smoothed_y = init.position[1]

			function modGimbal([x, y]: Vec2): Vec2 {
				y = scalar.spline.quickLinear(y, [0.1, 0.5, 0.7])
				return [x, y]
			}

			return {
				tick(_, state) {
					const moddedGimbal = modGimbal(state.gimbal)
					const localForce = gimbaltool(moddedGimbal).rotate(state.force)
					const quaternions = gimbaltool(moddedGimbal).quaternions()

					transform.rotationQuaternion = quaternions.horizontal
					torusRoot.rotationQuaternion = quaternions.vertical

					capsule.applyMovement(localForce)

					smoothed_y = molasses(
						3,
						smoothed_y,
						capsule.position.y,
					)

					const smoothed_position: Vec3 = [
						capsule.position.x,
						smoothed_y,
						capsule.position.z,
					]

					state.position = smoothed_position
					state.rotation = babylonian.to.quat(transform.rotationQuaternion)

					transform.position = babylonian.from.vec3(
						molasses3d(
							state.smoothing,
							babylonian.to.vec3(transform.position),
							state.position,
						)
					)
				},
				end() {},
			}
		}),
])

