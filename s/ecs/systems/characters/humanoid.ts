
import {Ecs4, Vec3, babylonian} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {molasses, molasses3d} from "../utils/molasses.js"
import {apply_spline_to_gimbal_y} from "./simulation/apply_spline_to_gimbal_y.js"
import {create_humanoid_babylon_parts} from "./simulation/create_humanoid_babylon_parts.js"

export const humanoid = system("humanoid simulation", realm => {
	type Parts = ReturnType<typeof create_humanoid_babylon_parts>
	const store = new Map<Ecs4.Id, Parts>()

	return [
		behavior("create babylon parts")
			.select("humanoid", "height", "radius", "third_person_cam_distance", "camera", "position", "debug")
			.lifecycle(() => (init, id) => {
				store.set(id, create_humanoid_babylon_parts(realm, init))
				return {
					tick: () => {},
					end: () => store.delete(id),
				}
			}),

		behavior("set gimbal rotations onto transforms")
			.select("humanoid", "gimbal")
			.processor(() => () => (state, id) => {
				const {transform, torusRoot} = store.get(id)!
				const moddedGimbal = apply_spline_to_gimbal_y(state.gimbal, [.1, .5, .7])
				const quaternions = gimbaltool(moddedGimbal).quaternions()
				transform.rotationQuaternion = quaternions.horizontal
				torusRoot.rotationQuaternion = quaternions.vertical
			}),

		behavior("calculate local forces")
			.select("humanoid", "localForce", "intent", "gimbal", "force")
			.processor(() => () => state => {
				const moddedGimbal = apply_spline_to_gimbal_y(state.gimbal, [.1, .5, .7])
				state.localForce = gimbaltool(moddedGimbal).rotate(state.force)
			}),

		behavior("apply capsule movement")
			.select("humanoid", "localForce", "grounded")
			.processor(() => () => (state, id) => {
				const {capsule} = store.get(id)!
				const {grounded} = capsule.applyMovement(state.localForce)
				state.grounded = grounded
			}),

		behavior("update position and rotation")
			.select("humanoid", "position", "rotation")
			.lifecycle(_ => (init, id) => {
				const {capsule, transform} = store.get(id)!
				let smoothed_y = init.position[1]
				return {
					tick(_, state) {
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
						state.rotation = babylonian.to.quat(transform.rotationQuaternion!)
					},
					end() {},
				}
			}),

		behavior("apply transform position")
			.select("humanoid", "position", "smoothing")
			.processor(() => () => (state, id) => {
				const {transform} = store.get(id)!
				transform.position = babylonian.from.vec3(
					molasses3d(
						state.smoothing,
						babylonian.to.vec3(transform.position),
						state.position,
					)
				)
			}),
	]
})

// export const humanoid = system("characters", () => [

// 	behavior("create and simulate humanoid capsule")
// 		.select(
// 			"humanoid",
// 			"debug",
// 			"third_person_cam_distance",
// 			"camera",
// 			"radius",
// 			"height",
// 			"jump",
// 			"smoothing",
// 			"position",
// 			"rotation",
// 			"gimbal",
// 			"force",
// 		)
// 		.lifecycle(realm => init => {
// 			const {
// 				transform,
// 				torusRoot,
// 				capsule,
// 			} = create_humanoid_babylon_parts(realm, init)

// 			let smoothed_y = init.position[1]

// 			return {
// 				tick(tick, state) {
// 					const moddedGimbal = modGimbal(state.gimbal)
// 					const localForce = gimbaltool(moddedGimbal).rotate(state.force)
// 					const quaternions = gimbaltool(moddedGimbal).quaternions()

// 					transform.rotationQuaternion = quaternions.horizontal
// 					torusRoot.rotationQuaternion = quaternions.vertical

// 					const {grounded} = capsule.applyMovement(localForce)

// 					if (grounded && state.jump.button) {
// 						const since = tick.tick - state.jump.tick
// 						if (since > state.jump.cooldown) {
// 						}
// 					}

// 					smoothed_y = molasses(
// 						3,
// 						smoothed_y,
// 						capsule.position.y,
// 					)

// 					const smoothed_position: Vec3 = [
// 						capsule.position.x,
// 						smoothed_y,
// 						capsule.position.z,
// 					]

// 					state.position = smoothed_position
// 					state.rotation = babylonian.to.quat(transform.rotationQuaternion)

// 					transform.position = babylonian.from.vec3(
// 						molasses3d(
// 							state.smoothing,
// 							babylonian.to.vec3(transform.position),
// 							state.position,
// 						)
// 					)
// 				},
// 				end() {},
// 			}
// 		}),
// ])

