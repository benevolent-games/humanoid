
import {Ecs4, Vec3, babylonian, vec3} from "@benev/toolbox"

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
				const parts = create_humanoid_babylon_parts(realm, init)
				store.set(id, parts)
				return {
					tick: () => {},
					end: () => {
						store.delete(id)
						parts.dispose()
					},
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

		behavior("set impetus, based on force, speeds, and stance")
			.select("humanoid", "gimbal", "force", "intent", "speeds", "stance", "impetus", "grounding")
			.processor(() => tick => state => {
				const {stance, force, intent, speeds, grounding} = state
				const [x, z] = force
				let target = vec3.zero()

				if (grounding.grounded) {
					if (stance === "stand") {
						if (z > 0.01 && intent.fast) {
							target = vec3.multiplyBy(
								vec3.normalize([(x / 2), 0, z]),
								speeds.fast * tick.seconds,
							)
						}
						else {
							target = vec3.multiplyBy(
								[x, 0, z],
								intent.slow
									? speeds.slow
									: speeds.base,
							)
						}
					}
					else if (stance === "crouch") {
						target = vec3.multiplyBy(
							[x, 0, z],
							intent.slow
								? speeds.slow / 3
								: speeds.slow,
						)
					}

					state.impetus = gimbaltool(state.gimbal).rotate(target)
				}
			}),

		behavior("apply artificial gravity to impetus")
			.select("humanoid", "impetus", "grounding")
			.processor(() => tick => state => {
				const {grounded, seconds} = state.grounding
				const subtle_grounding_force = 0.1

				let y = -subtle_grounding_force

				if (!grounded) {
					const magic_bonus = 1
					const terminal_velocity = 50
					const velocity_based_on_airtime = magic_bonus + (9.81 * seconds)

					const gravity_in_meters_per_second = Math.min(
						velocity_based_on_airtime,
						terminal_velocity,
					)

					const gravity_for_this_tick = (
						gravity_in_meters_per_second * tick.seconds
					)

					y = -gravity_for_this_tick
				}

				state.impetus[1] = y
			}),

		behavior("apply capsule movement")
			.select("humanoid", "impetus", "grounding")
			.processor(() => tick => (state, id) => {
				const {capsule} = store.get(id)!
				const {grounded} = capsule.applyMovement(state.impetus)

				const isChanged = grounded !== state.grounding.grounded
				if (isChanged)
					state.grounding.seconds = 0

				state.grounding.grounded = grounded
				state.grounding.seconds += tick.seconds
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

