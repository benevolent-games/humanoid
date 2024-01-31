
import {Vec2, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {HumanoidSchema} from "../../../schema.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {AdjustmentAnims, Ambulatory, Choreography} from "../../../../models/choreographer/types.js"

export function sync_character_anims({
		stance,
		gimbal: [,vertical],
		anims,
		choreo,
		ambulatory,
		boss_anim,
		adjustment_anims,
		anim_speed_modifier,
	}: {
		stance: HumanoidSchema["stance"]
		gimbal: Vec2
		choreo: Choreography
		ambulatory: Ambulatory
		anims: CharacterAnims
		boss_anim: AnimationGroup
		anim_speed_modifier: number
		adjustment_anims: AdjustmentAnims
	}) {

	const {swivel, adjustment} = choreo

	function setSpeed(s: number) {
		boss_anim.speedRatio = s * anim_speed_modifier
	}

	const mod = function modulate_leg_weight(w: number) {
		return adjustment
			? scalar.clamp(w - calculate_adjustment_weight(adjustment.progress))
			: w
	}

	const b = (w: number) => scalar.spline.quickLinear(scalar.clamp(w), [
		0,
		.9,
		1,
	])

	const mag = scalar.spline.linear(
		ambulatory.magnitude,
		[
			[0.0, 0.0],
			[1.0, 1.0],
			[3.0, 1.5],
		],
	)

	setSpeed(mag)

	for (const anim of Object.values(anims))
		anim.weight = 0

	if (adjustment)
		adjustment_anims.update(adjustment)

	if (stance === "stand") {
		const sprint = scalar.clamp(ambulatory.north - 1)
		const noSprint = 1 - sprint
		anims.stand.weight = ambulatory.stillness
		anims.stand_sprint.weight = sprint * b(mod(ambulatory.north))
		anims.stand_forward.weight = noSprint * b(mod(ambulatory.north))
		anims.stand_backward.weight = b(mod(ambulatory.south))
		anims.stand_leftward.weight = b(mod(ambulatory.west))
		anims.stand_rightward.weight = b(mod(ambulatory.east))
	}
	else if (stance === "crouch") {
		anims.crouch.weight = ambulatory.stillness
		anims.crouch_forward.weight = b(mod(ambulatory.north))
		anims.crouch_backward.weight = b(mod(ambulatory.south))
		anims.crouch_leftward.weight = b(mod(ambulatory.west))
		anims.crouch_rightward.weight = b(mod(ambulatory.east))
	}

	anims.twohander.weight = ambulatory.stillness
	anims.twohander_forward.weight = b(ambulatory.north)
	anims.twohander_backward.weight = b(ambulatory.south)
	anims.twohander_leftward.weight = b(ambulatory.west)
	anims.twohander_rightward.weight = b(ambulatory.east)

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.hips_swivel.weight = 1
	anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

////////////////////////////////////////
////////////////////////////////////////

function calculate_adjustment_weight(progress: number) {
	return scalar.spline.quickLinear(progress, [0, 1, 1, 0])
}

