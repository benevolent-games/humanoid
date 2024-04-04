
import {scalar, vec2} from "@benev/toolbox"

import {avg} from "../../tools/avg.js"
import {behavior, system} from "../hub.js"
import {molasses2d} from "../../tools/molasses.js"
import {halfcircle} from "../../tools/halfcircle.js"
import {Gimbal, Intent, GimbalSway, Orbit, Controllable} from "../components/plain_components.js"

export const freelook = system("freelook", ({realm}) => [
	behavior("apply freelook, onto glance and gimbal based on intent")
		.select({Intent, Gimbal})
		.logic(() => ({components}) => {
			const {
				gimbal: [gimbalX, gimbalY],
				intent: {glance: [glanceX, glanceY]},
			} = components

			const x = gimbalX + glanceX
			const y = scalar.clamp(
				gimbalY + glanceY,
				scalar.radians.from.degrees(-90),
				scalar.radians.from.degrees(90),
			)

			components.gimbal = [x, y]
		}),

	behavior("apply freelook onto orbit")
		.select({Controllable, Orbit, Gimbal})
		.logic(() => ({components: c}) => {
			const wasActive = !!c.orbit
			const active = realm.tact.inputs.humanoid.buttons.orbit.input.down
			const hasChanged = active !== wasActive
			if (hasChanged)
				c.orbit = active
					? c.gimbal
					: null
		}),

	behavior("calculate gimbal sway")
		.select({Gimbal, GimbalSway})
		.logic(() => ({components: {gimbal, gimbalSway}}) => {
			gimbalSway.records = avg.vec2.append(5, gimbalSway.records, gimbal)
			const average = avg.vec2.average(gimbalSway.records)
			const smoothed = molasses2d(5, gimbalSway.gimbal, average)

			const diff = vec2.subtract(gimbal, average)
			const [x, y] = vec2.add(smoothed, diff)

			const [initX, initY] = gimbal
			const bound = scalar.radians.from.degrees(20)
			const aX = scalar.nearby(initX, x, bound)
			const aY = scalar.nearby(initY, y, bound)

			gimbalSway.gimbal = [aX, scalar.clamp(aY, ...halfcircle)]
		}),
])

