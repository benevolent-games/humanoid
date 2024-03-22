
import {babylonian} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"
import {Melee} from "../../../models/attacking/melee.js"
import {Character} from "../../schema/hybrids/character/character.js"
import {sync_character_anims} from "../../schema/hybrids/character/choreography/sync_character_anims.js"
import {apply_adjustments, swivel_effected_by_glance} from "../../schema/hybrids/character/choreography/calculations.js"
import {Ambulation, Choreography, Gimbal, Intent, Perspective, Position, CoolGimbal, Speeds, MeleeAction} from "../../schema/schema.js"

export const choreography = system("humanoid", [
	behavior("sync babylon parts")
		.select({Character, Position, CoolGimbal, Gimbal, Perspective})
		.act(() => c => {
			const q = babylonian.to.quat(
				gimbaltool(c.coolGimbal.gimbal)
					.quaternions().horizontal
			)
			c.character.parts.position.set(...c.position)
			c.character.parts.rotation.set(...q)
		}),

	behavior("set swivel")
		.select({Choreography, Intent})
		.act(() => c => {
			c.choreography.swivel = swivel_effected_by_glance(
				c.choreography.swivel,
				c.intent.glance,
			)
		}),

	behavior("animate the armature")
		.select({Character, Choreography, Ambulation, Intent, Gimbal, CoolGimbal, Speeds, Perspective, MeleeAction})
		.act(() => c => {
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

