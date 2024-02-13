
import {vec2} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {Force, Intent, Smoothing} from "../../schema/schema.js"
import {molasses2d} from "../../../ecs/systems/utils/molasses.js"

export const force = behavior("calculate force, based on intent and smoothing")
	.select({Force, Intent, Smoothing})
	.act(({tick}) => c => {
		const {force, intent, smoothing} = c
		const target = vec2.multiplyBy(intent.amble, tick.seconds)
		c.force = molasses2d(smoothing, force, target)
	})

