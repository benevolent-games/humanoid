
import {babylonian} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {gimbaltool} from "../../tools/gimbaltool.js"
import {Melee} from "../../models/attacking/melee.js"
import {Character} from "../components/hybrids/character/character.js"
import {sync_character_anims} from "../components/hybrids/character/choreography/sync_character_anims.js"
import {apply_adjustments, swivel_effected_by_glance} from "../components/hybrids/character/choreography/calculations.js"
import {Ambulation, Choreography, Gimbal, Intent, Perspective, Position, CoolGimbal, Speeds, MeleeAction} from "../components/plain_components.js"

export const choreography = system("humanoid", () => [
	behavior("sync babylon parts")
		.select({Character, Position, CoolGimbal})
		.logic(() => ({components: {character, position, coolGimbal}}) => {
			const q = babylonian.to.quat(
				gimbaltool(coolGimbal.gimbal)
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

	behavior("animate the armature")
		.select({Character, Choreography, Ambulation, Gimbal, CoolGimbal, Speeds, Perspective, MeleeAction})
		.logic(() => ({components: c}) => {
			const {adjustment_anims, anims, boss_anim} = c.character.coordination

			apply_adjustments(
				adjustment_anims,
				c.ambulation,
				c.choreography,
				3,
			)

			sync_character_anims({
				anims,
				boss_anim,
				gimbal: c.coolGimbal.gimbal,
				choreo: c.choreography,
				meleeWeights: c.meleeAction?.weights ?? Melee.zeroWeights(),
				ambulatory: c.ambulation,
				perspective: c.perspective,
				speeds: {...c.speeds, creep: 1.5},
			})
		}),
])

