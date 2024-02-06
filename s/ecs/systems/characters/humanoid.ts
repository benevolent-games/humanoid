
import {Ecs4, Vec3, ascii_progress_bar, babylonian, scalar, vec2, vec3} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {unflatten} from "../utils/flatten.js"
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

		behavior("reset impetus")
			.select("humanoid", "impetus")
			.processor(() => () => state => {
				state.impetus = vec3.zero()
			}),

		behavior("impetus for walking around")
			.select("humanoid", "gimbal", "force", "intent", "speeds", "stance", "impetus", "grounding")
			.processor(() => tick => state => {
				const {stance, force, intent, speeds, grounding, gimbal, impetus} = state
				const [x, z] = force

				if (grounding.grounded) {
					let target = vec3.zero()

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

					state.impetus = vec3.add(
						impetus,
						gimbaltool(gimbal).rotate(target),
					)
				}
			}),

		system("airborne", () => [
			behavior("airborne trajectory damping")
				.select("humanoid", "airborne_trajectory")
				.processor(() => () => state => {
					const {airborne_trajectory} = state
					state.airborne_trajectory = molasses3d(
						100,
						airborne_trajectory,
						vec3.zero(),
					)
				}),

			behavior("airborne player control")
				.select("humanoid", "gimbal", "force", "grounding", "airborne_trajectory")
				.processor(() => tick => state => {
					const factor = 1 / 3
					const maxSpeed = 5 * tick.seconds
					const {force, grounding, gimbal, airborne_trajectory} = state

					if (!grounding.grounded) {
						const global_airforce = unflatten(vec2.multiplyBy(force, factor))
						const airforce = gimbaltool(gimbal).rotate(global_airforce)
						const new_trajectory = vec3.add(airborne_trajectory, airforce)

						if (vec3.magnitude(new_trajectory) > maxSpeed) {
							const direction = vec3.normalize(new_trajectory)
							const scaled_airforce = vec3.multiplyBy(direction, maxSpeed - vec3.magnitude(airborne_trajectory))
							state.airborne_trajectory = vec3.add(airborne_trajectory, scaled_airforce)
						}
						else {
							state.airborne_trajectory = new_trajectory
						}
					}
				}),

			behavior("apply airborne trajectory to impetus")
				.select("humanoid", "impetus", "grounding", "airborne_trajectory")
				.processor(() => () => state => {
					const {grounding, impetus, airborne_trajectory} = state
					if (!grounding.grounded)
						state.impetus = vec3.add(impetus, airborne_trajectory)
				}),
		]),

		behavior("apply artificial gravity on impetus")
			.select("humanoid", "impetus", "grounding")
			.processor(() => tick => state => {
				const {grounded, seconds} = state.grounding
				const subtle_grounding_force = 0.5 * tick.seconds

				let y = -subtle_grounding_force

				if (!grounded) {
					const magic_bonus = 0
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

		behavior("add jump power to impetus")
			.select("humanoid", "impetus", "grounding", "intent", "jump")
			.processor(() => tick => state => {
				const {intent, jump, grounding} = state
				const {grounded} = grounding

				const power = 7
				const cooldown = 0.1

				function phase_start_jump(jump: boolean): jump is false {
					return !!(!jump && grounded && (grounding.seconds > cooldown) && intent.jump)
				}

				function phase_sustain_jump(jump: boolean): jump is true {
					return !!(jump && !grounded)
				}

				function phase_end_jump(jump: boolean): jump is true {
					return !!(jump && grounded)
				}

				const force = power * tick.seconds
				const kick = force * (9 / 10)
				let y = 0

				if (phase_start_jump(jump)) {
					state.jump = true
					y += kick
				}
				else if (phase_sustain_jump(jump)) {
					y += scalar.spline.linear(grounding.seconds, [
						[0.0, kick],
						[0.1, force],
						[0.5, 0],
					])
				}
				else if (phase_end_jump(jump)) {
					state.jump = false
				}

				state.impetus[1] += y
			}),

		behavior("apply capsule movement, set grounding and airborne_trajectory")
			.select("humanoid", "impetus", "grounding", "airborne_trajectory")
			.processor(() => tick => (state, id) => {
				const {capsule} = store.get(id)!
				const {grounded} = capsule.applyMovement(state.impetus)

				const isChanged = grounded !== state.grounding.grounded
				if (isChanged) {
					state.grounding.seconds = 0
					if (grounded)
						state.airborne_trajectory = vec3.zero()
					else
						state.airborne_trajectory = state.impetus
				}

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

