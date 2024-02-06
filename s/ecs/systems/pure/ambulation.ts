
import {Vec2, scalar, vec2} from "@benev/toolbox"

import {behavior} from "../../hub.js"
import {flatten} from "../utils/flatten.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {molasses, molasses2d} from "../utils/molasses.js"

export type Ambulatory = {
	magnitude: number
	north: number
	west: number
	south: number
	east: number
	standing: number
	groundage: number
}

export const ambulation = behavior("calculate ambulatory")
	.select("velocity", "ambulatory", "speeds", "gimbal", "stance", "grounding")
	.lifecycle(() => () => {

	const smooth = {
		globalvel: vec2.zero(),
		normal: vec2.zero(),
		standing: 1,
		groundage: 0,
	}

	// const bottom = 0.1
	const smoothing = 5

	return {
		end() {},
		tick(tick, state) {
			const globalvel = vec2.multiplyBy(
				flatten(state.velocity),
				tick.hz,
			)

			smooth.globalvel = molasses2d(
				smoothing,
				smooth.globalvel,
				globalvel,
			)

			smooth.normal = molasses2d(
				smoothing,
				smooth.normal,
				vec2.normalize(globalvel),
			)

			smooth.standing = molasses(
				smoothing,
				smooth.standing,
				state.stance === "stand"
					? 1
					: 0,
			)

			smooth.groundage = molasses(
				smoothing,
				smooth.groundage,
				state.grounding.grounded
					? 1
					: 0,
			)

			const magnitude = vec2.magnitude(smooth.globalvel)

			state.ambulatory = {
				magnitude,
				standing: smooth.standing,
				groundage: smooth.groundage,
				...cardinalize(
					gimbaltool(state.gimbal)
						.unrotate2d(smooth.normal)
				),
			}
		},
	}
})

function cardinalize([x, y]: Vec2) {
	return {
		north: scalar.clamp(y),
		south: scalar.clamp(-y),
		west: scalar.clamp(-x),
		east: scalar.clamp(x),
	}
}

