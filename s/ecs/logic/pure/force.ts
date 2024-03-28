
import {vec2} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Force, Intent, Smoothing} from "../../schema/schema.js"

export const force = behavior("calculate force, based on intent and smoothing")
	.select({Force, Intent, Smoothing})
	.logic(() => tick => ({components}) => {
		const {force, intent, smoothing} = components
		const target = vec2.multiplyBy(intent.amble, tick.seconds)
		components.force = molasses2d(smoothing, force, target)
	})

