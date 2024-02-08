
import {Noise, scalar} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {molasses2d} from "../utils/molasses.js"

const noise = Noise.seed(1)

export const ai = system("ai", _realm => [

	behavior("dumb wandering")
		.select("ai", "seed", "intent", "gimbal", "stance")
		.processor(() => tick => state => {
			// const n = (x: number) => (x * 2) - 1

			// const fastrandy = new Randy(Randy.seed(state.seed + Math.floor(tick.gametime / 0.2)))
			// const randy = new Randy(Randy.seed(state.seed + Math.floor(tick.gametime / 3)))
			// const n = (x: number) => (x * 2) - 1
			// const r = () => randy.random()
			// const bell = () => {
			// 	let rand = 0
			// 	for (let i = 0; i < 6; i++)
			// 		rand += randy.random()
			// 	return rand / 6
			// }

			// console.log(noise2d(tick.gametime, state.seed))

			const scale = 1 / 3
			const strafe = scalar.center(noise.sample(scale * tick.gametime, state.seed + 100))
			const walk = scalar.clamp(
				noise.sample(tick.gametime) +
				scalar.center(noise.sample(scale * tick.gametime, state.seed))
			)

			state.intent.amble = molasses2d(20, state.intent.amble, [walk, strafe])

			// state.intent.glance[0] = noise.sample(1 / 3 + tick.gametime, state.seed + 200),

			// state.intent.glance[0] = n(r()) / 100
			// state.gimbal[1] = molasses(10, state.gimbal[1], bell())

			// const speedroll = r()
			// state.intent.fast = speedroll > 0.7
			// state.intent.slow = speedroll < 0.1

			// state.stance = randy.roll(0.9)
			// 	? "stand"
			// 	: "crouch"

			// state.intent.attack = fastrandy.roll(1 / 20)
			// state.intent.jump = fastrandy.roll(1 / 20)
		})
])

