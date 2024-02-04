
import {vec3} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {flatten} from "../utils/flatten.js"
import {molasses3d} from "../utils/molasses.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {calculate_ambulatory_report} from "../characters/choreography/calculations.js"

export const ambulation = behavior("calculate ambulatory")
	.select("velocity", "ambulatory", "speeds", "gimbal")
	.lifecycle(() => init => {

	let smoothed_velocity = init.velocity

	return {
		end() {},
		tick(tick, state) {

			smoothed_velocity = molasses3d(
				5,
				smoothed_velocity,
				vec3.multiplyBy(state.velocity, (1 / tick.deltaSeconds))
			)

			const localized_velocity = (
				gimbaltool(state.gimbal)
					.unrotate(smoothed_velocity)
			)

			state.ambulatory = calculate_ambulatory_report(
				flatten(localized_velocity)
			)
		},
	}
})

