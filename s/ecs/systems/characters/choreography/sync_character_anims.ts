
import {Speeds, Vec2, scalar} from "@benev/toolbox"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

import {Ambulatory} from "../../pure/ambulation.js"
import {CharacterAnims} from "./setup_character_anims.js"
import {setup_anim_modulators} from "./animworks/modulators.js"
import {Choreography} from "../../../../models/choreographer/types.js"

export function sync_character_anims({
		anims,
		choreo,
		speeds,
		boss_anim,
		ambulatory,
		gimbal: [,vertical],
	}: {
		gimbal: Vec2
		speeds: Speeds & {creep: number}
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

	anims.twohander_airborne.weight = airborne

	anims.twohander.weight = groundage * stillness
	anims.twohander_forward.weight = groundage * unstillness * north
	anims.twohander_backward.weight = groundage * unstillness * south
	anims.twohander_leftward.weight = groundage * unstillness * west
	anims.twohander_rightward.weight = groundage * unstillness * east

	//
	// specials
	//

	anims.spine_bend.weight = 1
	anims.spine_bend.forceFrame(vertical * anims.spine_bend.to)

	anims.hips_swivel.weight = 1
	anims.hips_swivel.forceFrame(swivel * anims.hips_swivel.to)
}

