
import {Vec2, ascii_progress_bar, human, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Ambulatory} from "../../pure/ambulation.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {HumanoidSchema, HumanoidTick} from "../../../schema.js"
import {AdjustmentAnims, Choreography} from "../../../../models/choreographer/types.js"

export function sync_character_anims({
		tick,
		stance,
		gimbal: [,vertical],
		anims,
		choreo,
		ambulatory,
		boss_anim,
		adjustment_anims,
	}: {
		tick: HumanoidTick
		stance: HumanoidSchema["stance"]
		gimbal: Vec2
		choreo: Choreography
		ambulatory: Ambulatory
		anims: CharacterAnims
		boss_anim: AnimationGroup
		adjustment_anims: AdjustmentAnims
	}) {

	// const {swivel, adjustment} = choreo

	const bottom = 0.1
	const slow = 0.5
	const walk = 1.5
	const run = 3.0
	const sprint = 5.0

	// // 0  bottom  slow  walk  run  sprint
	// // |     |     |     |     |     |
	// // ['''''|'''''|'''''|'''''|''''']
	// // 1.....0
	// const stillness = scalar.clamp(
	// 	scalar.remap(ambulatory.magnitude, [bottom, 0])
	// )

	// // 0  bottom  slow  walk  run  sprint
	// // |     |     |     |     |     |
	// // ['''''|'''''|'''''|'''''|''''']
	// // 1.....0
	// function unstillness(m: number) {
	// 	return scalar.clamp(
	// 		scalar.remap(m, [0, bottom])
	// 	)
	// }

	// 0  bottom  slow  walk  run  sprint
	// |     |     |     |     |     |
	// ['''''|'''''|'''''|'''''|''''']
	//                         0.....1
	function sprintiness(m: number) {
		return scalar.clamp(
			scalar.remap(m, [run, sprint])
		)
	}

	// 0  bottom  slow  walk  run  sprint
	// |     |     |     |     |     |
	// ['''''|'''''|'''''|'''''|''''']
	//                         1.....0
	function runniness(m: number) {
		const s = sprintiness(m)
		return scalar.clamp(m - s)
		// return scalar.clamp(
		// 	scalar.remap(m, [run, sprint], [1, 0])
		// )
	}

	// 0  bottom  slow  walk  run  sprint
	// |     |     |     |     |     |
	// ['''''|'''''|'''''|'''''|''''']
	// 0.............................2
	const runSpeed = scalar.clamp(
		scalar.remap(ambulatory.magnitude, [bottom, sprint], [0, 2]),
		0,
		2,
	)

	// 0  bottom  slow  walk  run  sprint
	// |     |     |     |     |     |
	// ['''''|'''''|'''''|'''''|''''']
	// 0.................1.....2
	const crouchSpeed = scalar.clamp(
		scalar.spline.linear(ambulatory.magnitude, [
			[0, 0],
			[walk, 1],
			[run, 2],
		])
	)

	// reset all anim weights
	for (const anim of Object.values(anims))
		anim.weight = 0

	if (stance === "stand") {
		boss_anim.speedRatio = runSpeed
		const u = ambulatory.unstillness
		anims.stand.weight = ambulatory.stillness
		anims.stand_sprint.weight = u * sprintiness(ambulatory.north)
		anims.stand_forward.weight = u * runniness(ambulatory.north)
		anims.stand_backward.weight = u * runniness(ambulatory.south)
		anims.stand_leftward.weight = u * runniness(ambulatory.west)
		anims.stand_rightward.weight = u * runniness(ambulatory.east)
	}
	else if (stance === "crouch") {
		// const speed = scalar.spline.linear(ambulatory.magnitude, [
		// 	[0.0, 0.2],
		// 	[1.5, 1.0],
		// 	[5.0, 2.0],
		// ])
		// boss_anim.speedRatio = speed

		// const b = (x: number) => scalar.clamp(
		// 	scalar.spline.linear(x, [
		// 		[0.0, 0.0],
		// 		[0.4, 1.0],
		// 	])
		// )
		// anims.crouch.weight = stillness
		// if ((tick.count % 60) === 0) {
		// 	console.log("speed", speed.toFixed(2))
		// 	console.log("stillness", stillness.toFixed(2))
		// }
		// anims.crouch_forward.weight = b(ambulatory.north)
		// anims.crouch_backward.weight = b(ambulatory.south)
		// anims.crouch_leftward.weight = b(ambulatory.west)
		// anims.crouch_rightward.weight = b(ambulatory.east)
	}

	// // if (adjustment)
	// // 	adjustment_anims.update(adjustment)

	// if (stance === "stand") {
	// 	const sprint = scalar.clamp(ambulatory.north - 1)
	// 	const noSprint = 1 - sprint
	// 	anims.stand.weight = ambulatory.stillness
	// 	anims.stand_sprint.weight = sprint * b(mod(ambulatory.north))
	// 	anims.stand_forward.weight = noSprint * b(mod(ambulatory.north))
	// 	anims.stand_backward.weight = b(mod(ambulatory.south))
	// 	anims.stand_leftward.weight = b(mod(ambulatory.west))
	// 	anims.stand_rightward.weight = b(mod(ambulatory.east))
	// }
	// else if (stance === "crouch") {
	// 	anims.crouch.weight = ambulatory.stillness
	// 	anims.crouch_forward.weight = b(mod(ambulatory.north * 2))
	// 	anims.crouch_backward.weight = b(mod(ambulatory.south * 2))
	// 	anims.crouch_leftward.weight = b(mod(ambulatory.west * 2))
	// 	anims.crouch_rightward.weight = b(mod(ambulatory.east * 2))
	// }

	// anims.twohander.weight = ambulatory.stillness
	// anims.twohander_forward.weight = b(ambulatory.north)
	// anims.twohander_backward.weight = b(ambulatory.south)
	// anims.twohander_leftward.weight = b(ambulatory.west)
	// anims.twohander_rightward.weight = b(ambulatory.east)

	// anims.spine_bend.weight = 1
	// anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	// anims.hips_swivel.weight = 1
	// anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

function calculate_adjustment_weight(progress: number) {
	return scalar.spline.quickLinear(progress, [0, 1, 1, 0])
}





// export function sync_character_anims({
// 		stance,
// 		gimbal: [,vertical],
// 		anims,
// 		choreo,
// 		ambulatory,
// 		boss_anim,
// 		adjustment_anims,
// 		anim_speed_modifier,
// 	}: {
// 		stance: HumanoidSchema["stance"]
// 		gimbal: Vec2
// 		choreo: Choreography
// 		ambulatory: Ambulatory
// 		anims: CharacterAnims
// 		boss_anim: AnimationGroup
// 		anim_speed_modifier: number
// 		adjustment_anims: AdjustmentAnims
// 	}) {

// 	const {swivel, adjustment} = choreo

// 	function setSpeed(s: number) {
// 		boss_anim.speedRatio = s * anim_speed_modifier
// 	}

// 	const mod = function modulate_leg_weight(w: number) {
// 		return adjustment
// 			? scalar.clamp(w - calculate_adjustment_weight(adjustment.progress))
// 			: w
// 	}

// 	const b = (w: number) => scalar.spline.quickLinear(
// 		scalar.clamp(w),
// 		[0, .9, 1],
// 	)

// 	const mag = scalar.spline.linear(
// 		ambulatory.magnitude,
// 		[
// 			[0.0, 0.0],
// 			[1.0, 1.0],
// 			[3.0, 1.5],
// 		],
// 	)

// 	setSpeed(mag)

// 	for (const anim of Object.values(anims))
// 		anim.weight = 0

// 	if (adjustment)
// 		adjustment_anims.update(adjustment)

// 	if (stance === "stand") {
// 		const sprint = scalar.clamp(ambulatory.north - 1)
// 		const noSprint = 1 - sprint
// 		anims.stand.weight = ambulatory.stillness
// 		anims.stand_sprint.weight = sprint * b(mod(ambulatory.north))
// 		anims.stand_forward.weight = noSprint * b(mod(ambulatory.north))
// 		anims.stand_backward.weight = b(mod(ambulatory.south))
// 		anims.stand_leftward.weight = b(mod(ambulatory.west))
// 		anims.stand_rightward.weight = b(mod(ambulatory.east))
// 	}
// 	else if (stance === "crouch") {
// 		anims.crouch.weight = ambulatory.stillness
// 		anims.crouch_forward.weight = b(mod(ambulatory.north * 2))
// 		anims.crouch_backward.weight = b(mod(ambulatory.south * 2))
// 		anims.crouch_leftward.weight = b(mod(ambulatory.west * 2))
// 		anims.crouch_rightward.weight = b(mod(ambulatory.east * 2))
// 	}

// 	anims.twohander.weight = ambulatory.stillness
// 	anims.twohander_forward.weight = b(ambulatory.north)
// 	anims.twohander_backward.weight = b(ambulatory.south)
// 	anims.twohander_leftward.weight = b(ambulatory.west)
// 	anims.twohander_rightward.weight = b(ambulatory.east)

// 	anims.spine_bend.weight = 1
// 	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

// 	anims.hips_swivel.weight = 1
// 	anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
// }

// ////////////////////////////////////////
// ////////////////////////////////////////

// function calculate_adjustment_weight(progress: number) {
// 	return scalar.spline.quickLinear(progress, [0, 1, 1, 0])
// }

