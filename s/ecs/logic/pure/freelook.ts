
import {scalar, vec2} from "@benev/toolbox"
import {avg} from "../../../tools/avg.js"
import {behavior, system} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Gimbal, Intent, CoolGimbal} from "../../schema/schema.js"

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

	behavior("calculate cool gimbal")
		.select({Gimbal, CoolGimbal})
		.act(() => ({gimbal, coolGimbal: cool}) => {
			cool.records = avg.vec2.append(4, cool.records, gimbal)
			const average = avg.vec2.average(cool.records)
			const smoothed = molasses2d(4, cool.gimbal, average)
			const jitter = vec2.subtract(gimbal, average)
			cool.gimbal = vec2.add(smoothed, jitter)
		}),
])

