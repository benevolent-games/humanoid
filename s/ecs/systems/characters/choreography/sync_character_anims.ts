
import {Vec2, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Ambulatory} from "../../pure/ambulation.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {HumanoidSchema, HumanoidTick} from "../../../schema.js"
import {AdjustmentAnims, Choreography} from "../../../../models/choreographer/types.js"

export function sync_character_anims({
		gimbal: [,vertical],
		anims,
		ambulatory,
		boss_anim,
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
	// 0..........0.5....1.....2
	const crouchSpeed = scalar.spline.linear(ambulatory.magnitude, [
		[0, 0],
		[slow, 0.3],
		[walk, 0.7],
		[run, 2],
	])

	const u = ambulatory.unstillness
	const standing = (x: number) => scalar.map(ambulatory.standing, [0, x])
	const crouching = (x: number) => scalar.map(ambulatory.standing, [x, 0])
	const ultimate_speed = scalar.map(ambulatory.standing, [crouchSpeed, runSpeed])

	// reset all anim weights
	for (const anim of Object.values(anims))
		anim.weight = 0

	boss_anim.speedRatio = ultimate_speed
	anims.stand.weight = standing(ambulatory.stillness)
	anims.crouch.weight = crouching(ambulatory.stillness)

	anims.stand_sprint.weight = standing(u * sprintiness(ambulatory.north))
	anims.stand_forward.weight = standing(u * runniness(ambulatory.north))
	anims.stand_backward.weight = standing(u * runniness(ambulatory.south))
	anims.stand_leftward.weight = standing(u * runniness(ambulatory.west))
	anims.stand_rightward.weight = standing(u * runniness(ambulatory.east))

	anims.crouch_forward.weight = crouching(u * runniness(ambulatory.north))
	anims.crouch_backward.weight = crouching(u * runniness(ambulatory.south))
	anims.crouch_leftward.weight = crouching(u * runniness(ambulatory.west))
	anims.crouch_rightward.weight = crouching(u * runniness(ambulatory.east))

	anims.twohander.weight = ambulatory.stillness
	anims.twohander_forward.weight = u * ambulatory.north
	anims.twohander_backward.weight = u * ambulatory.south
	anims.twohander_leftward.weight = u * ambulatory.west
	anims.twohander_rightward.weight = u * ambulatory.east

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	// anims.hips_swivel.weight = 1
	// anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

