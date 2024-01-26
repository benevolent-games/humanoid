
import {vec3} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {molasses3d} from "../utils/molasses.js"

export const force = behavior("calculate force based on intent and stance")
	.select("force", "stance", "intent", "smoothing", "speeds")
	.processor(_realm => tick => state => {

	const {force, stance, intent, smoothing, speeds} = state
	const {amble} = intent
	const [x, y, z] = amble

	let cool = vec3.zero()

	if (stance === "fly") {
		cool = vec3.multiplyBy(
			intent.amble,
			intent.fast ? speeds.fast
				: intent.slow ? speeds.slow
				: speeds.base,
		)
	}

	if (stance === "stand") {
		if (z > 0 && intent.fast)
			cool = vec3.multiplyBy(
				vec3.normalize([
					x / 2,
					y / 2,
					z,
				]),
				speeds.fast,
			)
		else {
			cool = vec3.multiplyBy(
				intent.amble,
				intent.slow
					? speeds.slow
					: speeds.base,
			)
		}
	}
	else if (stance === "crouch") {
		cool = vec3.multiplyBy(
			intent.amble,
			intent.slow
				? speeds.slow / 3
				: speeds.slow,
		)
	}

	const target = vec3.multiplyBy(cool, tick.deltaTime)
	state.force = molasses3d(smoothing, force, target)
})

