
import {vec3} from "@benev/toolbox"
import {behavior} from "../../hub.js"

export const velocity = behavior("calculate velocity")
	.select("position", "velocity")
	.lifecycle(() => () => {

	let previous_position = vec3.zero()

	return {
		end() {},
		tick(_tick, state) {
			state.velocity = vec3.subtract(state.position, previous_position)
			previous_position = state.position
		},
	}
})

