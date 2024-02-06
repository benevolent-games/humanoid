
import {Vec2, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Ambulatory} from "../../pure/ambulation.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {HumanoidSchema, HumanoidTick} from "../../../schema.js"
import {AdjustmentAnims, Choreography} from "../../../../models/choreographer/types.js"

export function sync_character_anims({
		anims,
		choreo,
		boss_anim,
		ambulatory,
		gimbal: [,vertical],
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

	const {swivel} = choreo

	// const bottom = 0.1
	const slow = 0.5
	const walk = 1.5
	const run = 3.0
	const sprint = 5.0

	// 0  bottom  slow  walk  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	//                         0.....1
	function sprintiness(m: number) {
		return scalar.clamp(
			scalar.remap(m, [run, sprint])
		)
	}

	// 0  bottom  slow  walk  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	//                         1.....0
	function runniness(m: number) {
		const s = sprintiness(m)
		return scalar.clamp(m - s)
	}

	// 0  bottom  slow  walk  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	// 0.............................2
	const runSpeed = scalar.clamp(
		scalar.remap(ambulatory.magnitude, [0, sprint], [0, 2]),
		0,
		2,
	)

	// 0  bottom  slow  walk  run  sprint
	// ['''''|'''''|'''''|'''''|''''']
	// 0..........0.3...0.7....2
	const crouchSpeed = scalar.spline.linear(ambulatory.magnitude, [
		[0, 0],
		[slow, 0.3],
		[walk, 0.7],
		[run, 2],
	])

	const {standing, north, south, west, east} = ambulatory
	const unstillness = scalar.clamp(ambulatory.magnitude)
	const ultimate_speed = scalar.map(standing, [crouchSpeed, runSpeed])

	const calc_stillness = (...weights: number[]) => {
		const unstill = scalar.clamp(weights.reduce((a, b) => a + b, 0))
		return scalar.clamp(1 - unstill)
	}
	const calc_standing = (x: number) => scalar.clamp(x * standing)
	const calc_crouching = (x: number) => scalar.clamp(x * (1 - standing))

	// reset all anim weights
	for (const anim of Object.values(anims))
		anim.weight = 0

	boss_anim.speedRatio = ultimate_speed

	anims.stand_sprint.weight = calc_standing(unstillness * sprintiness(north))
	anims.stand_forward.weight = calc_standing(unstillness * runniness(north))
	anims.stand_backward.weight = calc_standing(unstillness * runniness(south))
	anims.stand_leftward.weight = calc_standing(unstillness * runniness(west))
	anims.stand_rightward.weight = calc_standing(unstillness * runniness(east))

	anims.crouch_forward.weight = calc_crouching(unstillness * runniness(north))
	anims.crouch_backward.weight = calc_crouching(unstillness * runniness(south))
	anims.crouch_leftward.weight = calc_crouching(unstillness * runniness(west))
	anims.crouch_rightward.weight = calc_crouching(unstillness * runniness(east))

	const stillness = calc_stillness(
		anims.stand_sprint.weight,
		anims.stand_forward.weight,
		anims.stand_backward.weight,
		anims.stand_leftward.weight,
		anims.stand_rightward.weight,

		anims.crouch_forward.weight,
		anims.crouch_backward.weight,
		anims.crouch_leftward.weight,
		anims.crouch_rightward.weight,
	)

	anims.stand.weight = calc_standing(stillness)
	anims.crouch.weight = calc_crouching(stillness)

	anims.twohander.weight = stillness
	anims.twohander_forward.weight = unstillness * north
	anims.twohander_backward.weight = unstillness * south
	anims.twohander_leftward.weight = unstillness * west
	anims.twohander_rightward.weight = unstillness * east

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.hips_swivel.weight = 1
	anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

