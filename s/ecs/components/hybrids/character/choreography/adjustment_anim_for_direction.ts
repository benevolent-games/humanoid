
import {CharacterAnims} from "./setup_character_anims.js"
import {AdjustmentDirection} from "../../../../../models/choreographer/types.js"

export function adjustment_anim_for_direction(
		anims: CharacterAnims,
		direction: AdjustmentDirection,
	) {

	return direction === "left"
		? anims.stand_legadjust_left
		: anims.stand_legadjust_right
}

