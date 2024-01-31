
import {Ecs4, vec3} from "@benev/toolbox"
import {flatten} from "../utils/flatten.js"
import {behavior, system} from "../../hub.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {apply_3d_rotation_to_movement} from "./simulation/apply_3d_rotation_to_movement.js"
import {create_spectator_babylon_parts} from "./simulation/create_spectator_babylon_parts.js"

export const spectator = system("spectator", () => {
	type Parts = ReturnType<typeof create_spectator_babylon_parts>
	const store = new Map<Ecs4.Id, Parts>()
	return [

		behavior("create babylon parts")
			.select("spectator", "camera", "position")
			.lifecycle(realm => (init, id) => {
				const part = create_spectator_babylon_parts(realm, init)
				store.set(id, part)
				return {
					tick: () => {},
					end: () => {
						store.delete(id)
						part.dispose()
					}
				}
			}),

		behavior("set gimbal quaternions")
			.select("spectator", "gimbal")
			.processor(() => () => (state, id) => {
				const {transformA, transformB} = store.get(id)!
				const quaternions = gimbaltool(state.gimbal).quaternions()
				transformB.rotationQuaternion = quaternions.vertical
				transformA.rotationQuaternion = quaternions.horizontal
			}),

		behavior("calculate local force")
			.select("spectator", "force", "intent", "speeds", "localForce")
			.processor(() => () => state => {
				const {force, intent, speeds} = state
				state.localForce = vec3.multiplyBy(
					force,
					intent.fast ? speeds.fast
						: intent.slow ? speeds.slow
						: speeds.base,
				)
			}),

		behavior("apply force to position")
			.select("spectator", "position", "localForce")
			.processor(() => () => (state, id) => {
				const {transformA, transformB} = store.get(id)!
				state.position = (
					apply_3d_rotation_to_movement(
						transformB,
						state.position,
						flatten(state.localForce),
					)
				)
				transformA.position.set(...state.position)
			}),

		behavior("apply position to transform")
			.select("spectator", "position")
			.processor(() => () => (state, id) => {
				const {transformA} = store.get(id)!
				transformA.position.set(...state.position)
			}),
	]
})

// export const spectator = behavior("spectator")
// 	.select(
// 		"spectator",
// 		"force",
// 		"gimbal",
// 		"position",
// 		"speeds",
// 		"camera",
// 	)
// 	.lifecycle(realm => init => {

// 	const {stage} = realm
// 	const {rendering} = stage
// 	const {transformA, transformB, camera} = (
// 		create_spectator_babylon_parts(realm, init)
// 	)

// 	return {
// 		tick(_tick, state) {
// 			const {force} = state
// 			const quaternions = gimbaltool(state.gimbal).quaternions()

// 			state.position = (
// 				apply_3d_rotation_to_movement(
// 					transformB,
// 					state.position,
// 					flatten(force),
// 				)
// 			)

// 			transformA.position.set(...state.position)
// 			transformB.rotationQuaternion = quaternions.vertical
// 			transformA.rotationQuaternion = quaternions.horizontal
// 		},
// 		end() {
// 			if (rendering.camera === camera)
// 				rendering.setCamera(null)
// 			camera.dispose()
// 			transformA.dispose()
// 		},
// 	}
// })

