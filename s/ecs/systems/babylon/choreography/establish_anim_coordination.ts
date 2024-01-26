
import {scalar} from "@benev/toolbox"

import {Realm} from "../../../../models/realm/realm.js"
import {make_dummy_anim_group} from "./dummy_anim_group.js"
import {setup_character_anims} from "./setup_character_anims.js"
import {AdjustmentAnims} from "../../../../models/choreographer/types.js"
import {CharacterInstance} from "../../../../models/character/instance.js"
import {adjustment_anim_for_direction} from "./adjustment_anim_for_direction.js"
import {calculate_adjustment_weight} from "../../../../models/choreographer/utils/calculate_adjustment_weight.js"

export function establish_anim_coordination(realm: Realm, character: CharacterInstance) {
	const anims = setup_character_anims(character)

	const ambulation_anims = [
		anims.stand_forward,
		anims.stand_backward,
		anims.stand_leftward,
		anims.stand_rightward,
		anims.stand_sprint,

		anims.crouch_forward,
		anims.crouch_backward,
		anims.crouch_leftward,
		anims.crouch_rightward,

		anims.fists_forward,
		anims.fists_backward,
		anims.fists_leftward,
		anims.fists_rightward,
		anims.fists_sprint,

		anims.twohander,
		anims.twohander_forward,
		anims.twohander_backward,
		anims.twohander_leftward,
		anims.twohander_rightward,
		anims.twohander_sprint,
	]

	const boss_anim = make_dummy_anim_group({
		scene: realm.stage.scene,
		frames: anims.stand_forward.to,
		framerate: 60,
	})

	boss_anim.play(true)

	for (const anim of ambulation_anims)
		anim.group?.syncAllAnimationsWith(boss_anim.animatables[0])

	// initialize with tpose
	if (anims.tpose.group) {
		anims.tpose.group.weight = -1
		anims.tpose.group.play(false)
		anims.tpose.group.pause()
		anims.tpose.group.goToFrame(0)
	}

	const adjustment_anims: AdjustmentAnims = {
		start: () => {},
		stop: () => {
			anims.stand_legadjust_left.weight = 0
			anims.stand_legadjust_right.weight = 0
		},
		update: ({direction, progress}) => {
			const anim = adjustment_anim_for_direction(anims, direction)
			const frame = scalar.map(progress, [
				anim.from,
				anim.to,
			])
			anim.weight = calculate_adjustment_weight(progress)
			anim.forceFrame(frame)
		},
	}

	return {anims, boss_anim, adjustment_anims}
}

