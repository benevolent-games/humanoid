
import {BasedAnim} from "../../../../../models/choreographer/anims/based.js"
import {ManualAnim} from "../../../../../models/choreographer/anims/manual.js"
import {ContainerInstance} from "../../../../../models/glb/container_instance.js"
import {manifest_anims} from "../../../../../models/choreographer/utils/manifest_anims.js"
import {ManualAdditiveAnim} from "../../../../../models/choreographer/anims/manual_additive.js"

export type CharacterAnims = ReturnType<typeof setup_character_anims>

export const setup_character_anims = (
		character: ContainerInstance,
		onMissingAnim: (name: string) => void,
	) => manifest_anims({

	tpose: g => new ManualAnim(g),

	airborne: g => new BasedAnim(g),

	stand: g => new BasedAnim(g),
	stand_forward: g => new BasedAnim(g),
	stand_backward: g => new BasedAnim(g),
	stand_leftward: g => new BasedAnim(g),
	stand_rightward: g => new BasedAnim(g),
	stand_sprint: g => new BasedAnim(g),
	stand_legadjust_left: g => new ManualAdditiveAnim(g, 0),
	stand_legadjust_right: g => new ManualAdditiveAnim(g, 0),

	crouch_forward: g => new BasedAnim(g),
	crouch_backward: g => new BasedAnim(g),
	crouch_leftward: g => new BasedAnim(g),
	crouch_rightward: g => new BasedAnim(g),
	crouch_legadjust_left: g => new ManualAdditiveAnim(g, 0),
	crouch_legadjust_right: g => new ManualAdditiveAnim(g, 0),
	crouch: g => new BasedAnim(g),

	unarmed: g => new BasedAnim(g),
	unarmed_airborne: g => new BasedAnim(g),
	unarmed_forward: g => new BasedAnim(g),
	unarmed_backward: g => new BasedAnim(g),
	unarmed_leftward: g => new BasedAnim(g),
	unarmed_rightward: g => new BasedAnim(g),
	unarmed_sprint: g => new BasedAnim(g),

	fists: g => new BasedAnim(g),
	fists_airborne: g => new BasedAnim(g),
	fists_forward: g => new BasedAnim(g),
	fists_backward: g => new BasedAnim(g),
	fists_leftward: g => new BasedAnim(g),
	fists_rightward: g => new BasedAnim(g),
	fists_sprint: g => new BasedAnim(g),
	fists_parry: g => new ManualAnim(g),
	fists_attack_1: g => new ManualAnim(g),
	fists_attack_2: g => new ManualAnim(g),
	fists_attack_3: g => new ManualAnim(g),
	fists_attack_4: g => new ManualAnim(g),
	fists_attack_5: g => new ManualAnim(g),
	fists_attack_6: g => new ManualAnim(g),
	fists_attack_7: g => new ManualAnim(g),
	fists_attack_8: g => new ManualAnim(g),

	twohander: g => new BasedAnim(g),
	twohander_airborne: g => new BasedAnim(g),
	twohander_forward: g => new BasedAnim(g),
	twohander_backward: g => new BasedAnim(g),
	twohander_leftward: g => new BasedAnim(g),
	twohander_rightward: g => new BasedAnim(g),
	twohander_sprint: g => new BasedAnim(g),
	twohander_parry: g => new ManualAnim(g),
	twohander_attack_1: g => new ManualAnim(g),
	twohander_attack_2: g => new ManualAnim(g),
	twohander_attack_3: g => new ManualAnim(g),
	twohander_attack_4: g => new ManualAnim(g),
	twohander_attack_5: g => new ManualAnim(g),
	twohander_attack_6: g => new ManualAnim(g),
	twohander_attack_7: g => new ManualAnim(g),
	// twohander_attack_8: g => new ManualAnim(g),

	onehander: g => new BasedAnim(g),
	onehander_airborne: g => new BasedAnim(g),
	onehander_forward: g => new BasedAnim(g),
	onehander_backward: g => new BasedAnim(g),
	onehander_leftward: g => new BasedAnim(g),
	onehander_rightward: g => new BasedAnim(g),
	onehander_sprint: g => new BasedAnim(g),
	onehander_parry: g => new ManualAnim(g),
	onehander_shield_parry: g => new ManualAnim(g),
	onehander_attack_1: g => new ManualAnim(g),
	onehander_attack_2: g => new ManualAnim(g),
	onehander_attack_3: g => new ManualAnim(g),
	onehander_attack_4: g => new ManualAnim(g),
	onehander_attack_5: g => new ManualAnim(g),
	onehander_attack_6: g => new ManualAnim(g),
	onehander_attack_7: g => new ManualAnim(g),
	// onehander_attack_8: g => new ManualAnim(g),

	equip: g => new ManualAnim(g),

	head_scale: g => new ManualAnim(g),
	grip_left: g => new ManualAnim(g),
	grip_right: g => new ManualAnim(g),
	legs_swivel: g => new ManualAdditiveAnim(g, 0.5),
	spine_lean: g => new ManualAdditiveAnim(g, 0.5),
	spine_bend: g => new ManualAdditiveAnim(g, 0.5),

}, name => character.animationGroups.get(name), onMissingAnim)

