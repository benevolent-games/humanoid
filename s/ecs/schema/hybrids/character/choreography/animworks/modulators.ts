
import {Ambulatory} from "../../../../types.js"
import {Speeds, scalar, spline} from "@benev/toolbox"

export function setup_anim_modulators({
		speeds: {base, fast, slow, creep},
		ambulatory: {magnitude, standing, groundage},
	}: {
		ambulatory: Ambulatory
		speeds: Speeds & {creep: number}
	}) {

	// 0  bottom creep  slow  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	//                         0.....1
	function sprinting(m: number) {
		return scalar.clamp(
			scalar.remap(m, [base, fast])
		)
	}

	// 0  bottom creep  slow  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	//                         1.....0
	function running(m: number) {
		const s = sprinting(m)
		return scalar.clamp(m - s)
	}

	// 0  bottom creep  slow  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	// 0.............................2
	const runSpeed = scalar.clamp(
		scalar.remap(magnitude, [0, fast], [0, 2]),
		0,
		2,
	)

	// 0  bottom creep  slow  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	// 0..........0.3...0.7....2
	const crouchSpeed = spline.linear(magnitude, [
		[0, 0],
		[creep, 0.3],
		[slow, 0.7],
		[base, 2],
	])

	const unstillness = scalar.clamp(magnitude)
	const ambulation_speed = scalar.map(standing, [crouchSpeed, runSpeed])

	const calc_stillness = (...weights: number[]) => {
		const unstill = scalar.clamp(weights.reduce((a, b) => a + b, 0))
		return scalar.clamp(1 - unstill)
	}

	return {

		/** speed that ambulation animations should be playing at, 0 to 1 */
		ambulation_speed,

		/** 1 means character is on the ground, 0 means they are airborne */
		groundage,

		/** 1 means character is standing, 0 means the character is crouching */
		standing,

		/** 0 means the characer is still, 1 means the character is moving */
		unstillness,

		/** convert ambulatory cardinal into running weight (not concerned with the speed range of sprinting) */
		running,

		/** convert ambulatory cardinal into sprinting weight (not concerned with the speed range of running) */
		sprinting,

		/** derive the current stillness value directly by summing up ambulation weights */
		calc_stillness,
	}
}

