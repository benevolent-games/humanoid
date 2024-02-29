
import {babylonian} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"
import {Character} from "../../schema/hybrids/character/character.js"
import {swivel_effected_by_glance} from "../../schema/hybrids/character/choreography/calculations.js"
import {sync_character_anims} from "../../schema/hybrids/character/choreography/sync_character_anims.js"
import {Ambulation, Attackage, Choreography, Gimbal, Intent, Perspective, Position, SlowGimbal, Speeds} from "../../schema/schema.js"

export const choreography = system("humanoid", [
	behavior("sync babylon parts")
		.select({Character, Position, SlowGimbal, Gimbal})
		.act(() => c => {
			const q = babylonian.to.quat(
				gimbaltool(c.gimbal).quaternions().horizontal
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
		.select({Character, Choreography, Ambulation, Intent, Gimbal, SlowGimbal, Speeds, Attackage, Perspective})
		.act(() => c => {
			const {adjustment_anims, anims, boss_anim} = c.character.coordination

			// apply_adjustments(
			// 	adjustment_anims,
			// 	ambulatory,
			// 	state.choreography,
			// 	10,
			// )

			// c.choreography.swivel = molasses(
			// 	c.ambulation.magnitude > 0.1
			// 		? 2
			// 		: 3,
			// 	c.choreography.swivel,
			// 	0.5,
			// )

			c.choreography.swivel = 0.5

			anims.grip_left.forceProgress(1)
			anims.grip_right.forceProgress(1)

			sync_character_anims({
				anims,
				boss_anim,
				gimbal: c.gimbal,
				choreo: c.choreography,
				attackage: c.attackage,
				ambulatory: c.ambulation,
				perspective: c.perspective,
				speeds: {...c.speeds, creep: 1.5},
			})
		}),
])

