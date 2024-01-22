
import {scalar, vec3} from "@benev/toolbox"

import {hub} from "../hub.js"
import {flatten} from "./utils/flatten.js"
import {molasses3d} from "./utils/molasses.js"
import {gimbaltool} from "./utils/gimbaltool.js"
import {AdjustmentAnims} from "../../models/choreographer/types.js"
import {make_dummy_anim_group} from "./choreography/dummy_anim_group.js"
import {sync_character_anims} from "./choreography/sync_character_anims.js"
import {setup_character_anims} from "./choreography/setup_character_anims.js"
import {adjustment_anim_for_direction} from "./choreography/adjustment_anim_for_direction.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"
import {calculate_adjustment_weight} from "../../models/choreographer/utils/calculate_adjustment_weight.js"
import {calculate_ambulatory_report, apply_adjustments, swivel_effected_by_glance} from "./choreography/calculations.js"

export const choreography_system = hub
	.behavior("choreography")
	.select(
		"humanoid",
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
		scene: realm.stage.scene,
		characterContainer: realm.containers.character,
		state: init,
	})

	const anims = setup_character_anims(babylon.characterInstance)

	console.log("anims", anims)

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

	let smoothed_velocity = init.velocity

	return {
		execute(tick, state) {
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
				gimbal: state.gimbal,
				choreo: state.choreography,
				anims,
				ambulatory,
				boss_anim,
				adjustment_anims,
				anim_speed_modifier: 1.3,
			})
		},
		dispose() {
			babylon.dispose()
			boss_anim.dispose()
		},
	}
})

