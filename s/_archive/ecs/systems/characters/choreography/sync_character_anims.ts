
import {Speeds, Vec2, scalar, spline} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {HumanoidSchema} from "../../../schema.js"
import {Ambulatory} from "../../pure/ambulation.js"
import {attack_milestones} from "../attacking/attacks.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {setup_anim_modulators} from "./animworks/modulators.js"
import {Choreography} from "../../../../models/choreographer/types.js"

export function sync_character_anims({
		anims,
		choreo,
		speeds,
		attackage,
		boss_anim,
		ambulatory,
		gimbal: [,vertical],
	}: {
		gimbal: Vec2
		speeds: Speeds & {creep: number}
		attackage: HumanoidSchema["attackage"],
		choreo: Choreography
		ambulatory: Ambulatory
		anims: CharacterAnims
		boss_anim: AnimationGroup
	}) {

	const {swivel} = choreo
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
	} = setup_anim_modulators({ambulatory, speeds})

	const crouching = inverse(standing)
	const airborne = inverse(groundage)

	// reset all anim weights
	for (const anim of Object.values(anims))
		anim.weight = 0

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

	const tinyfix = 1 / 1000
	const {a, b, c, d} = attack_milestones
	const {attack, seconds} = attackage
	const blendtime = 0.1
	const attacking = attack === 0
		? 0
		: spline.linear(seconds, [
			[a, 0],
			[a + blendtime, 1],
			[c + blendtime, 1],
			[d + blendtime, 0],
		])
	const notAttacking = inverse(attacking)

	if (attacking > 0) {
		const attackframe = spline.linear(seconds, [
			[a, 0],
			[b, 20],
			[c, 65],
			[d, 87],
		])
		anims.twohander_attack_2.forceFrame(
			attack === 0
				? 0
				: attackframe
		)
	}

	anims.twohander_airborne.weight = airborne

	anims.twohander.weight = tinyfix + (notAttacking * groundage * stillness)
	anims.twohander_forward.weight = north * notAttacking * groundage * unstillness
	anims.twohander_backward.weight = south * notAttacking * groundage * unstillness
	anims.twohander_leftward.weight = west * notAttacking * groundage * unstillness
	anims.twohander_rightward.weight = east * notAttacking * groundage * unstillness

	anims.twohander_attack_2.weight = attacking

	//
	// specials
	//

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.hips_swivel.weight = 1
	anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

