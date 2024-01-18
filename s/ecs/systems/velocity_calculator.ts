
import {vec3} from "@benev/toolbox"
import {threadable} from "../hub.js"

export const velocity_calculator_system = threadable.lifecycle
	("velocity_calculator")(
		"position",
		"velocity",
	)(() => () => {

	let previous_position = vec3.zero()

	return {
		execute(_tick, state) {
			state.velocity = vec3.subtract(state.position, previous_position)
			previous_position = state.position
		},
		dispose() {},
	}
})

