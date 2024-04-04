
import {spline, vec2, vec3} from "@benev/toolbox"

import {unflatten} from "../../tools/flatten.js"
import {Capsule} from "../schema/hybrids/capsule.js"
import {gimbaltool} from "../../tools/gimbaltool.js"
import {behavior, responder, system} from "../hub.js"
import {molasses, molasses3d} from "../../tools/molasses.js"
import {AirborneTrajectory, Debug, Force, Gimbal, Grounding, Impetus, Intent, Jump, Position, PreviousPosition, Speeds, Stance} from "../schema/schema.js"

export const humanoid = system("humanoid", () => [
	responder("capsule debug")
		.select({Capsule, Debug})
		.respond(({components}) => {
			components.capsule.setDebug(components.debug)
		}),

	responder("establish capsule position")
		.select({Capsule, Position})
		.respond(({components}) => {
			components.capsule.position = components.position
		}),

	behavior("reset impetus")
		.select({Capsule, Impetus})
		.logic(() => ({components}) => {
			components.impetus = vec3.zero()
		}),

	behavior("impetus for walking around")
		.select({Capsule, Impetus, Force, Stance, Intent, Speeds, Grounding, Gimbal})
		.logic(tick => ({components}) => {
			const {stance, force, intent, speeds, grounding, gimbal, impetus} = components
			const [x, z] = force

			if (grounding.grounded) {
				let target = vec3.zero()

				if (stance === "stand") {
					if (z > 0.001 && intent.fast) {
						target = vec3.multiplyBy(
							vec3.normalize([(x / 3), 0, z]),
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

				components.impetus = vec3.add(
					impetus,
					gimbaltool(gimbal).rotate(target),
				)
			}
		}),

	behavior("airborne")
		.select({Capsule, AirborneTrajectory})
		.logic(() => ({components}) => {
			components.airborneTrajectory = molasses3d(
				100,
				components.airborneTrajectory,
				vec3.zero(),
			)
		}),

	behavior("apply reduced force onto airborneTrajectory")
		.select({Capsule, AirborneTrajectory, Force, Grounding, Gimbal})
		.logic(tick => ({components}) => {
			const factor = 1 / 5
			const maxSpeed = 5 * tick.seconds
			const {force, grounding, gimbal, airborneTrajectory} = components

			if (!grounding.grounded) {
				const global_airforce = unflatten(vec2.multiplyBy(force, factor))
				const airforce = gimbaltool(gimbal).rotate(global_airforce)
				const new_trajectory = vec3.add(airborneTrajectory, airforce)

				if (vec3.magnitude(new_trajectory) > maxSpeed) {
					const direction = vec3.normalize(new_trajectory)
					const scaled_airforce = vec3.multiplyBy(direction, maxSpeed - vec3.magnitude(airborneTrajectory))
					components.airborneTrajectory = vec3.add(airborneTrajectory, scaled_airforce)
				}
				else {
					components.airborneTrajectory = new_trajectory
				}
			}
		}),

	behavior("apply airborne trajectory to impetus")
		.select({Capsule, AirborneTrajectory, Grounding, Impetus})
		.logic(() => ({components}) => {
			const {grounding, impetus, airborneTrajectory} = components
			if (!grounding.grounded)
				components.impetus = vec3.add(impetus, airborneTrajectory)
		}),

	behavior("apply artificial gravity on impetus")
		.select({Capsule, Grounding, Impetus})
		.logic(tick => ({components}) => {
			const {grounded, seconds} = components.grounding
			const subtle_grounding_force = 5 * tick.seconds

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

			components.impetus[1] = y
		}),

	behavior("add jump power to impetus")
		.select({Capsule, Grounding, Intent, Jump, Impetus})
		.logic(tick => ({components}) => {
			const {intent, jump, grounding} = components
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
				components.jump = true
				y += kick
			}
			else if (phase_sustain_jump(jump)) {
				y += spline.linear(grounding.seconds, [
					[0.0, kick],
					[0.1, force],
					[0.5, 0],
				])
			}
			else if (phase_end_jump(jump)) {
				components.jump = false
			}

			components.impetus[1] += y
		}),

	behavior("apply capsule movement, set grounding and airborne_trajectory")
		.select({Capsule, Grounding, Impetus, AirborneTrajectory})
		.logic(tick => ({components: c}) => {
			const {capsule} = c.capsule
			const {grounded} = capsule.applyMovement(c.impetus)

			const isChanged = grounded !== c.grounding.grounded
			if (isChanged) {
				c.grounding.seconds = 0
				if (grounded)
					c.airborneTrajectory = vec3.zero()
				else
					c.airborneTrajectory = c.impetus
			}

			c.grounding.grounded = grounded
			c.grounding.seconds += tick.seconds
		}),

	behavior("update position with smoothing on y-axis")
		.select({Capsule, Position, PreviousPosition})
		.logic(() => ({components: c}) => {
			const [,previousY] = c.previousPosition
			const [x, y, z] = c.capsule.position
			const smoothY = molasses(3, previousY, y)
			c.position = [x, smoothY, z]
		}),
])

