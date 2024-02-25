
import {Vec2, scalar, vec2} from "@benev/toolbox"

import {behavior} from "../../hub.js"
import {flatten} from "../../../tools/flatten.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"
import {molasses, molasses2d} from "../../../tools/molasses.js"
import {Ambulation, Gimbal, Grounding, Speeds, Stance, Velocity} from "../../schema/schema.js"

const smoothing = 5

export const ambulation = behavior("calculate ambulatory data")
	.select({Ambulation, Velocity, Speeds, Gimbal, Stance, Grounding})
	.act(({tick}) => c => {
		const {smooth} = c.ambulation

		const globalvel = vec2.multiplyBy(
			flatten(c.velocity),
			tick.hz,
		)

		c.ambulation.smooth.globalvel = molasses2d(
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
			c.stance === "stand"
				? 1
				: 0,
		)

		smooth.groundage = molasses(
			smoothing,
			smooth.groundage,
			c.grounding.grounded
				? 1
				: 0,
		)

		const magnitude = vec2.magnitude(smooth.globalvel)

		c.ambulation = {
			smooth,
			magnitude,
			standing: smooth.standing,
			groundage: smooth.groundage,
			...cardinalize(
				gimbaltool(c.gimbal)
					.unrotate2d(smooth.normal)
			),
		}
	})

function cardinalize([x, y]: Vec2) {
	return {
		north: scalar.clamp(y),
		south: scalar.clamp(-y),
		west: scalar.clamp(x),
		east: scalar.clamp(-x),
	}
}

