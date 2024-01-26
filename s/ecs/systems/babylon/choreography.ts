
import {vec3} from "@benev/toolbox"

import {behavior} from "../../hub.js"
import {flatten} from "../utils/flatten.js"
import {molasses3d} from "../utils/molasses.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {sync_character_anims} from "./choreography/sync_character_anims.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"
import {apply_adjustments, calculate_ambulatory_report, swivel_effected_by_glance} from "./choreography/calculations.js"

export const choreography = behavior("choreography")
	.select(
		"humanoid",
		"stance",
		"height",
		"speeds",
		"position",
		"rotation",
		"gimbal",
		"intent",
		"velocity",
		"choreography",
	)
	.lifecycle(realm => init => {

	const babylon = prepare_choreographer_babylon_parts({
		state: init,
		scene: realm.stage.scene,
		character: realm.spawn.character(),
	})

	const {anims, boss_anim, adjustment_anims} = (
		establish_anim_coordination(realm, babylon.character)
	)

	let smoothed_velocity = init.velocity

	return {
		tick(tick, state) {
			babylon.position.set(...state.position)
			babylon.rotation.set(...state.rotation)

			smoothed_velocity = molasses3d(
				5,
				smoothed_velocity,
				vec3.divideBy(state.velocity, state.speeds.base * tick.deltaTime),
			)

			state.choreography.swivel = swivel_effected_by_glance(
				state.choreography.swivel,
				state.intent.glance,
			)

			const local_velocity = gimbaltool(state.gimbal).unrotate(smoothed_velocity)
			const ambulatory = calculate_ambulatory_report(flatten(local_velocity))

			apply_adjustments(
				adjustment_anims,
				ambulatory,
				state.choreography,
				10,
			)

			sync_character_anims({
				stance: state.stance,
				gimbal: state.gimbal,
				choreo: state.choreography,
				anims,
				ambulatory,
				boss_anim,
				adjustment_anims,
				anim_speed_modifier: 1.3,
			})
		},
		end() {
			boss_anim.dispose()
			babylon.dispose()
		},
	}
})

