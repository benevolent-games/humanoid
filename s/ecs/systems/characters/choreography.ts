
import {Ecs4, Vec3, vec3} from "@benev/toolbox"

import {flatten} from "../utils/flatten.js"
import {molasses3d} from "../utils/molasses.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {behavior, system, kinds} from "../../hub.js"
import {sync_character_anims} from "./choreography/sync_character_anims.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"
import {apply_adjustments, calculate_ambulatory_report, swivel_effected_by_glance} from "./choreography/calculations.js"

export const choreography = system("choreography", realm => {

	type Locals = {
		parts: ReturnType<typeof prepare_choreographer_babylon_parts>
		coordination: ReturnType<typeof establish_anim_coordination>
		smoothed_velocity: Vec3
	}

	const map = new Map<Ecs4.Id, Locals>()
	const selection = kinds(
		"choreography",
		"height",
		"position",
		"rotation",
		"velocity",
		"speeds",
		"intent",
		"gimbal",
		"stance",
	)

	return [
		behavior("create local parts")
			.select(...selection)
			.lifecycle(() => (init, id) => {
				const parts = prepare_choreographer_babylon_parts(
					realm.stage.scene,
					realm.spawn.character(),
					init.height,
				)

				parts.position.set(...init.position)
				parts.rotation.set(...init.rotation)

				const coordination = (
					establish_anim_coordination(realm, parts.character)
				)

				map.set(id, {
					parts,
					coordination,
					smoothed_velocity: init.velocity,
				})

				return {
					tick() {},
					end() {
						parts.dispose()
						coordination.dispose()
						map.delete(id)
					},
				}
			}),

		behavior("sync babylon parts")
			.select(...selection)
			.processor(() => () => (state, id) => {
				const {parts} = map.get(id)!
				parts.position.set(...state.position)
				parts.rotation.set(...state.rotation)
			}),

		behavior("calculate smoothed velocity")
			.select(...selection)
			.processor(() => tick => (state, id) => {
				const local = map.get(id)!
				local.smoothed_velocity = molasses3d(
					5,
					local.smoothed_velocity,
					vec3.divideBy(state.velocity, state.speeds.base * tick.deltaSeconds),
				)
			}),

		behavior("set swivel")
			.select(...selection)
			.processor(() => () => state => {
				state.choreography.swivel = swivel_effected_by_glance(
					state.choreography.swivel,
					state.intent.glance,
				)
			}),

		behavior("animate the armature")
			.select(...selection)
			.processor(() => () => (state, id) => {
				const local = map.get(id)!
				const local_velocity = gimbaltool(state.gimbal).unrotate(local.smoothed_velocity)
				const ambulatory = calculate_ambulatory_report(flatten(local_velocity))
				const {adjustment_anims, anims, boss_anim} = local.coordination

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
			}),
	]
})

