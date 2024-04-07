
import {babylonian} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {Weapon} from "../../models/armory/weapon.js"
import {gimbaltool} from "../../tools/gimbaltool.js"
import {Melee} from "../../models/attacking/melee.js"
import {Character} from "../components/hybrids/character/character.js"
import {sync_character_anims} from "../components/hybrids/character/choreography/sync_character_anims.js"
import {apply_adjustments, swivel_effected_by_glance} from "../components/hybrids/character/choreography/calculations.js"
import {Ambulation, Choreography, Gimbal, Intent, Perspective, Position, GimbalSway, Speeds, MeleeAction, MeleeWeapon} from "../components/plain_components.js"

export const choreography = system("humanoid", () => [
	behavior("sync babylon parts")
		.select({Character, Position, GimbalSway})
		.logic(() => ({components: {character, position, gimbalSway}}) => {
			const q = babylonian.to.quat(
				gimbaltool(gimbalSway.gimbal)
					.quaternions().horizontal
			)
			character.parts.position.set(...position)
			character.parts.rotation.set(...q)
		}),

	behavior("set swivel")
		.select({Choreography, Intent})
		.logic(() => ({components: {choreography, intent}}) => {
			choreography.swivel = swivel_effected_by_glance(
				choreography.swivel,
				intent.glance,
			)
		}),

	behavior("show active weapon")
		.select({Character, MeleeWeapon})
		.logic(() => ({components: {character, meleeWeapon}}) => {
			const weapon = Weapon.library[meleeWeapon]

			if (weapon.grip === "onehander") {
				const shield = character.weapons.left.get("shield")
				if (shield)
					shield.isVisible = !!shield
			}

			for (const [name, mesh] of character.weapons.right) {
				mesh.isVisible = name === meleeWeapon
			}
		}),

	behavior("animate the armature")
		.select({Character, Choreography, Ambulation, Gimbal, GimbalSway, Speeds, Perspective, MeleeAction, MeleeWeapon})
		.logic(() => ({components: c}) => {
			const {adjustment_anims, anims, boss_anim} = c.character.coordination

			apply_adjustments(
				adjustment_anims,
				c.ambulation,
				c.choreography,
				3,
			)

			const weapon = Weapon.library[c.meleeWeapon]

			sync_character_anims({
				anims,
				boss_anim,
				gimbal: c.gimbalSway.gimbal,
				choreo: c.choreography,
				meleeWeights: c.meleeAction?.weights ?? Melee.zeroWeights(weapon.grip),
				ambulatory: c.ambulation,
				perspective: c.perspective,
				speeds: {...c.speeds, creep: 1.5},
			})
		}),
])

