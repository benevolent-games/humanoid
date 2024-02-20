
import {Vec2, scalar, vec2} from "@benev/toolbox"

import {behavior} from "../../hub.js"
import {flatten} from "../../../tools/flatten.js"
import {Gimbal} from "../../schema/hybrids/gimbal.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"
import {molasses, molasses2d} from "../../../tools/molasses.js"
import {Ambulatory, Grounding, Speeds, Stance, Velocity} from "../../schema/schema.js"

const smoothing = 5

export const ambulation = behavior("calculate ambulatory data")
	.select({Ambulatory, Velocity, Speeds, Gimbal, Stance, Grounding})
	.act(({tick}) => state => {
		const {smooth} = state.ambulatory

		const globalvel = vec2.multiplyBy(
			flatten(state.velocity),
			tick.hz,
		)

		state.ambulatory.smooth.globalvel = molasses2d(
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
			smooth,
			magnitude,
			standing: smooth.standing,
			groundage: smooth.groundage,
			...cardinalize(
				gimbaltool(state.gimbal.state)
					.unrotate2d(smooth.normal)
			),
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
