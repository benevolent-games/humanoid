
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
	stillness: number
	unstillness: number
	standing: number
}

export const ambulation = behavior("calculate ambulatory")
	.select("velocity", "ambulatory", "speeds", "gimbal", "stance")
	.lifecycle(() => () => {

	const smooth = {
		globalvel: vec2.zero(),
		unstillness: 0,
		normal: vec2.zero(),
		standing: 1,
	}

	const bottom = 0.1
	const smoothing = 5

	return {
		end() {},
		tick(tick, state) {
			const globalvel = vec2.multiplyBy(
				flatten(state.velocity),
				tick.rate,
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

			smooth.unstillness = molasses(
				smoothing,
				smooth.unstillness,
				scalar.clamp(
					scalar.remap(
						vec2.magnitude(globalvel),
						[0, bottom],
					)
				),
			)

			smooth.standing = molasses(
				smoothing,
				smooth.standing,
				state.stance === "stand"
					? 1
					: 0,
			)

			const stillness = 1 - smooth.unstillness
			const magnitude = vec2.magnitude(smooth.globalvel)

			state.ambulatory = {
				magnitude,
				stillness,
				standing: smooth.standing,
				unstillness: smooth.unstillness,
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

