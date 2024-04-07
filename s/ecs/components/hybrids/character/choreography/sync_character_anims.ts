
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

	const grip = (() => (
		meleeWeights.grip === "fists" ? {
			guard: anims.fists,
			airborne: anims.fists_airborne,
			forward: anims.fists_forward,
			backward: anims.fists_backward,
			leftward: anims.fists_leftward,
			rightward: anims.fists_rightward,
			sprint: anims.fists_sprint,
			parry: anims.fists_parry,
			attack_1: anims.fists_attack_1,
			attack_2: anims.fists_attack_2,
			attack_3: anims.fists_attack_3,
			attack_4: anims.fists_attack_4,
			attack_5: anims.fists_attack_5,
			attack_6: anims.fists_attack_6,
			attack_7: anims.fists_attack_7,
			attack_8: anims.fists_attack_8,
		} :
		meleeWeights.grip === "twohander" ? {
			guard: anims.twohander,
			airborne: anims.twohander_airborne,
			forward: anims.twohander_forward,
			backward: anims.twohander_backward,
			leftward: anims.twohander_leftward,
			rightward: anims.twohander_rightward,
			sprint: anims.twohander_sprint,
			parry: anims.twohander_parry,
			attack_1: anims.twohander_attack_1,
			attack_2: anims.twohander_attack_2,
			attack_3: anims.twohander_attack_3,
			attack_4: anims.twohander_attack_4,
			attack_5: anims.twohander_attack_5,
			attack_6: anims.twohander_attack_6,
			attack_7: anims.twohander_attack_7,
			attack_8: anims.twohander_attack_8,
		} : {
			guard: anims.onehander,
			airborne: anims.onehander_airborne,
			forward: anims.onehander_forward,
			backward: anims.onehander_backward,
			leftward: anims.onehander_leftward,
			rightward: anims.onehander_rightward,
			sprint: anims.onehander_sprint,
			// parry: anims.onehander_parry,
			parry: anims.onehander_shield_parry,
			attack_1: anims.onehander_attack_1,
			attack_2: anims.onehander_attack_2,
			attack_3: anims.onehander_attack_3,
			attack_4: anims.onehander_attack_4,
			attack_5: anims.onehander_attack_5,
			attack_6: anims.onehander_attack_6,
			attack_7: anims.onehander_attack_7,
			attack_8: anims.onehander_attack_8,
		}
	))()

	const w = meleeWeights

	function animateAttack(anim: ManualAnim, weight: number) {
		anim.weight = weight
		if (weight)
			anim.forceProgress(w.progress)
	}

	animateAttack(grip.parry, w.parry)
	animateAttack(grip.attack_1, w.a1)
	animateAttack(grip.attack_2, w.a2)
	animateAttack(grip.attack_3, w.a3)
	animateAttack(grip.attack_4, w.a4)
	animateAttack(grip.attack_5, w.a5)
	animateAttack(grip.attack_6, w.a6)
	animateAttack(grip.attack_7, w.a7 + w.a8)
	// animateAttack(grip.attack_8, w.a8)

	const tinyfix = 1 / 1000
	grip.airborne.weight = airborne * w.inactive
	grip.guard.weight = tinyfix + (w.inactive * groundage * stillness)
	grip.forward.weight = tinyfix + north * w.inactive * groundage * unstillness
	grip.backward.weight = south * w.inactive * groundage * unstillness
	grip.leftward.weight = west * w.inactive * groundage * unstillness
	grip.rightward.weight = east * w.inactive * groundage * unstillness

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

