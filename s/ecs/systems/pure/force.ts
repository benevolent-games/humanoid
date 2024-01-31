
import {vec3} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {molasses3d} from "../utils/molasses.js"

export const force = behavior("calculate force based on intent and smoothing")
	.select("force", "intent", "smoothing")
	.processor(_realm => tick => state => {
		const {force, intent, smoothing} = state
		const target = vec3.multiplyBy(intent.amble, tick.deltaSeconds)
		state.force = molasses3d(smoothing, force, target)
})

