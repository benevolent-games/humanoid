
import {Noise, scalar} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {molasses, molasses2d} from "../utils/molasses.js"

const noise = Noise.seed(1)
const {clamp, center, magnify} = scalar

export const ai = system("ai", _realm => [

	behavior("dumb wandering")
		.select("ai", "seed", "intent", "gimbal", "stance")
		.processor(() => tick => state => {
			let count = 0

			function sample(scale = 1) {
				return noise.sample(
					scale * tick.gametime,
					(state.seed + count++) * 100,
				)
			}

			const strafe = center(sample())
			const walk = clamp(
				(sample(sample(1 / 10)) * 0.8) +
				center(sample(1 / 3))
			)

			state.intent.amble = molasses2d(20, state.intent.amble, [strafe, walk])

			state.intent.glance[0] = center(sample(3 / 10)) / 100

			const vertical = magnify(sample(1 / 10))
			state.gimbal[1] = molasses(10, state.gimbal[1], vertical)

			const speedroll = sample(1 / 10)
			state.intent.fast = speedroll > 0.7
			state.intent.slow = speedroll < 0.1

			state.stance = sample(1 / 10) < 0.8
				? "stand"
				: "crouch"

			state.intent.attack = sample(3) < 0.1
			state.intent.jump = sample(3) < 0.1
		})
])

