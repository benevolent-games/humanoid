
import {scalar} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Gimbal, Intent, SlowGimbal} from "../../schema/schema.js"

export const freelook = system("freelook", [
	behavior("apply freelook, onto glance and gimbal based on intent")
		.select({Intent, Gimbal})
		.act(() => c => {
			const {
				gimbal: [gimbalX, gimbalY],
				intent: {glance: [glanceX, glanceY]},
			} = c

			const x = gimbalX + glanceX

			// y axis must be doubled compared to x.
			//  - gimbalX and gimbalY are both between 0 and 1.
			//  - gimbalX represents 360 degrees of horizontal rotation.
			//  - gimbalY represents only 180 degrees of vertical rotation.
			//  - therefore, gimbalX packs "double the punch" of gimbalY.
			//  - thus, to compensate, we double our influence on gimbalY.
			const y = gimbalY + (glanceY * 2)

			c.gimbal = [x, scalar.clamp(y)]
		}),

	behavior("calculate slow gimbal")
		.select({Gimbal, SlowGimbal})
		.act(() => c => {
			c.slowGimbal = molasses2d(3, c.slowGimbal, c.gimbal)
		}),
])

