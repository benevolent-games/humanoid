
import {Ecs, Speeds, Vec2, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Ambulatory} from "../../../types.js"
import {setup_anim_modulators} from "./modulators.js"
import {Perspective} from "../../../plain_components.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {Weapon} from "../../../../../models/armory/weapon.js"
import {halfcircle} from "../../../../../tools/halfcircle.js"
import {Choreo} from "../../../../../models/choreographer/types.js"
import {ManualAnim} from "../../../../../models/choreographer/anims/manual.js"
import {ActivityWeights, AnimMoment} from "../../../../../models/choreographer/activities/kit/weights.js"

export function sync_character_anims({
		anims,
		choreo,
		speeds,
		gripName,
		shield,
		boss_anim,
		ambulatory,
		perspective,
		activityWeights,
		gimbal: [,gimbalY],
	}: {
		gimbal: Vec2
		choreo: Choreo
		gripName: Weapon.Grip
		shield: boolean
		anims: CharacterAnims
		ambulatory: Ambulatory
		boss_anim: AnimationGroup
		activityWeights: ActivityWeights
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

	Object.values(anims).forEach(anim => anim.weight = 0)
	anims.tpose.weight = -1
	anims.head_scale.weight = 1
	anims.grip_left.weight = 1
	anims.grip_right.weight = 1

	anims.head_scale.setProgress(
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

	const grip_groups = {
		fists: {
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
			// attack_8: anims.fists_attack_8,
		},
		onehander: {
			guard: anims.onehander,
			airborne: anims.onehander_airborne,
			forward: anims.onehander_forward,
			backward: anims.onehander_backward,
			leftward: anims.onehander_leftward,
			rightward: anims.onehander_rightward,
			sprint: anims.onehander_sprint,
			parry: shield
				? anims.onehander_shield_parry
				: anims.onehander_parry,
			attack_1: anims.onehander_attack_1,
			attack_2: anims.onehander_attack_2,
			attack_3: anims.onehander_attack_3,
			attack_4: anims.onehander_attack_4,
			attack_5: anims.onehander_attack_5,
			attack_6: anims.onehander_attack_6,
			attack_7: anims.onehander_attack_7,
			// attack_8: anims.onehander_attack_8,
		},
		twohander: {
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
			// attack_8: anims.twohander_attack_8,
		},
	} satisfies Record<Weapon.Grip, any>

	anims.onehander_parry.weight = 0
	anims.onehander_shield_parry.weight = 0

	Object.values(grip_groups)
		.forEach(anims => Object.values(anims)
			.forEach(anim => anim.weight = 0))

	const grip = grip_groups[gripName]
	const w = activityWeights

	function animateAttack(anim: ManualAnim, {weight, progress}: AnimMoment) {
		anim.weight = weight
		if (weight > (1 / 100))
			anim.setProgress(scalar.clamp(progress))
	}

	// console.log("active", w.active.toFixed(2), "::", w.a3.weight.toFixed(2), "++", w.a6.weight.toFixed(2))
	animateAttack(anims.equip, w.equip)
	animateAttack(grip.parry, w.parry)
	animateAttack(grip.attack_1, w.a1)
	animateAttack(grip.attack_2, w.a2)
	animateAttack(grip.attack_3, w.a3)
	animateAttack(grip.attack_4, w.a4)
	animateAttack(grip.attack_5, w.a5)
	animateAttack(grip.attack_6, w.a6)

	animateAttack(grip.attack_7, w.a7)
	// animateAttack(grip.attack_8, w.a8)

	const tinyfix = 1 / 1000
	const inactive = scalar.inverse(w.active)
	grip.airborne.weight = airborne * inactive
	grip.guard.weight = tinyfix + (inactive * groundage * stillness)
	grip.forward.weight = tinyfix + north * inactive * groundage * unstillness
	grip.backward.weight = south * inactive * groundage * unstillness
	grip.leftward.weight = west * inactive * groundage * unstillness
	grip.rightward.weight = east * inactive * groundage * unstillness

	//
	// specials
	//

	const vertical = scalar.remap(gimbalY, halfcircle)
	const swivel = scalar.remap(choreo.swivel, halfcircle)

	anims.spine_bend.weight = 1
	anims.spine_bend.setProgress(vertical)

	anims.legs_swivel.weight = 1
	anims.legs_swivel.setProgress(swivel)
}

