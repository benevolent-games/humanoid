
import {behavior} from "../../hub.js"
import {flatten} from "../utils/flatten.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {apply_3d_rotation_to_movement} from "./simulation/apply_3d_rotation_to_movement.js"
import {create_spectator_babylon_parts} from "./simulation/create_spectator_babylon_parts.js"

export const spectator = behavior("spectator")
	.select(
		"spectator",
		"force",
		"gimbal",
		"position",
		"speeds",
		"camera",
	)
	.lifecycle(realm => init => {

	const {stage} = realm
	const {rendering} = stage
	const {transformA, transformB, camera} = (
		create_spectator_babylon_parts(realm, init)
	)

	return {
		tick(_tick, state) {
			const {force} = state
			const quaternions = gimbaltool(state.gimbal).quaternions()

			state.position = (
				apply_3d_rotation_to_movement(
					transformB,
					state.position,
					flatten(force),
				)
			)

			transformA.position.set(...state.position)
			transformB.rotationQuaternion = quaternions.vertical
			transformA.rotationQuaternion = quaternions.horizontal
		},
		end() {
			if (rendering.camera === camera)
				rendering.setCamera(null)
			camera.dispose()
			transformA.dispose()
		},
	}
})

