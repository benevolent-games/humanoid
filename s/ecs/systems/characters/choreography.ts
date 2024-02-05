
import {Ecs4} from "@benev/toolbox"

import {molasses} from "../utils/molasses.js"
import {behavior, system, kinds} from "../../hub.js"
import {swivel_effected_by_glance} from "./choreography/calculations.js"
import {sync_character_anims} from "./choreography/sync_character_anims.js"
import {establish_anim_coordination} from "./choreography/establish_anim_coordination.js"
import {prepare_choreographer_babylon_parts} from "./choreography/prepare_choreographer_babylon_parts.js"

export const choreography = system("choreography", realm => {
	type Locals = {
		parts: ReturnType<typeof prepare_choreographer_babylon_parts>
		coordination: ReturnType<typeof establish_anim_coordination>
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
		"ambulatory",
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
			.processor(() => tick => (state, id) => {
				const local = map.get(id)!
				const {adjustment_anims, anims, boss_anim} = local.coordination

				// apply_adjustments(
				// 	adjustment_anims,
				// 	ambulatory,
				// 	state.choreography,
				// 	10,
				// )

				state.choreography.swivel = molasses(
					20,
					state.choreography.swivel,
					0.5,
				)

				sync_character_anims({
					tick,
					stance: state.stance,
					gimbal: state.gimbal,
					choreo: state.choreography,
					ambulatory: state.ambulatory,
					anims,
					boss_anim,
					adjustment_anims,
				})
			}),
	]
})

