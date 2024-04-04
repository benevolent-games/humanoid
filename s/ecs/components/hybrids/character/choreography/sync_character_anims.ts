
import {Ecs, Speeds, Vec2, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Ambulatory} from "../../../types.js"
import {Perspective} from "../../../plain_components.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {halfcircle} from "../../../../../tools/halfcircle.js"
import {Melee} from "../../../../../models/attacking/melee.js"
import {setup_anim_modulators} from "./modulators.js"
import {Choreo} from "../../../../../models/choreographer/types.js"
import {ManualAnim} from "../../../../../models/choreographer/anims/manual.js"

export function sync_character_anims({
		anims,
		choreo,
		speeds,
		boss_anim,
		ambulatory,
		perspective,
		meleeWeights,
		gimbal: [,gimbalY],
	}: {
		gimbal: Vec2
		choreo: Choreo
		anims: CharacterAnims
		ambulatory: Ambulatory
		boss_anim: AnimationGroup
		meleeWeights: Melee.Weights
		perspective: Ecs.ComponentState<Perspective>
		speeds: Speeds & {creep: number}
	}) {

	const top_speed_anim_ratio = 1.5
	const {inverse} = scalar
	const {north, south, west, east} = ambulatory
	const {
		ambulation_speed,
		groundage,
		standing,
		unstillness,
		running,
		sprinting,
		calc_stillness,
	} = setup_anim_modulators({ambulatory, speeds, top_speed_anim_ratio})

	const crouching = inverse(standing)
	const airborne = inverse(groundage)

	anims.grip_left.forceProgress(1)
	anims.grip_right.forceProgress(1)
	anims.head_scale.forceProgress(
		(perspective === "first_person")
			? 0.05
			: 0.5
	)

	boss_anim.speedRatio = ambulation_speed

	//
	// lower-body
	//

	anims.airborne.weight = airborne
	anims.stand_sprint.weight = sprinting(north) * standing * unstillness * groundage

	anims.stand_forward.weight = running(north) * standing * unstillness * groundage
	anims.stand_backward.weight = running(south) * standing * unstillness * groundage
	anims.stand_leftward.weight = running(west) * standing * unstillness * groundage
	anims.stand_rightward.weight = running(east) * standing * unstillness * groundage

	anims.crouch_forward.weight = running(north) * crouching * unstillness * groundage
	anims.crouch_backward.weight = running(south) * crouching * unstillness * groundage
	anims.crouch_leftward.weight = running(west) * crouching * unstillness * groundage
	anims.crouch_rightward.weight = running(east) * crouching * unstillness * groundage

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

	anims.stand.weight = standing * groundage * stillness
	anims.crouch.weight = crouching * groundage * stillness

	//
	// upper-body
	//

	const w = meleeWeights

	function animateAttack(anim: ManualAnim, weight: number) {
		anim.weight = weight
		if (weight)
			anim.forceProgress(w.progress)
	}

	animateAttack(anims.twohander_parry1, w.parry)
	animateAttack(anims.twohander_attack_1, w.a1)
	animateAttack(anims.twohander_attack_2, w.a2)
	animateAttack(anims.twohander_attack_3, w.a3)
	animateAttack(anims.twohander_attack_4, w.a4)
	animateAttack(anims.twohander_attack_5, w.a5)
	animateAttack(anims.twohander_attack_6, w.a6)
	animateAttack(anims.twohander_attack_7, w.a7 + w.a8)
	// animateAttack(anims.twohander_attack_8, w.a8)

	const tinyfix = 1 / 1000
	anims.twohander_parry1.weight = meleeWeights.parry
	anims.twohander_airborne.weight = airborne * w.inactive
	anims.twohander.weight = tinyfix + (w.inactive * groundage * stillness)
	anims.twohander_forward.weight = north * w.inactive * groundage * unstillness
	anims.twohander_backward.weight = south * w.inactive * groundage * unstillness
	anims.twohander_leftward.weight = west * w.inactive * groundage * unstillness
	anims.twohander_rightward.weight = east * w.inactive * groundage * unstillness

	//
	// specials
	//

	const vertical = scalar.remap(gimbalY, halfcircle)
	const swivel = scalar.remap(choreo.swivel, halfcircle)

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.legs_swivel.weight = 1
	anims.legs_swivel.forceFrame(swivel * anims.legs_swivel.to)
}

