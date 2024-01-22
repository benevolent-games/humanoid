
import {hub} from "../hub.js"
import {vec3} from "@benev/toolbox"

export const velocity_calculator_system = hub
	.behavior("velocity_calculator")
	.select("position", "velocity")
	.lifecycle(() => () => {

	let previous_position = vec3.zero()

	return {
		execute(_tick, state) {
			state.velocity = vec3.subtract(state.position, previous_position)
			previous_position = state.position
		},
		dispose() {},
	}
})

