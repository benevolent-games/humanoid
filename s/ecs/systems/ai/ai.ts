
import {molasses} from "../utils/molasses.js"
import {behavior, system} from "../../hub.js"
import {Randy, loop, scalar} from "@benev/toolbox"

export function random_ai_track(seed: number): number[] {
	const random = Randy.seed(seed)
	const randoms: number[] = []

	for (const _ of loop(20))
		randoms.push(random())

	return [0, ...randoms, 0]
}

const {clamp} = scalar

export const ai = system("ai", _realm => [

	behavior("dumb wandering")
		.select("ai", "seed", "intent", "gimbal", "stance")
		.processor(() => tick => state => {
			const fastrandy = new Randy(Randy.seed(state.seed + Math.floor(tick.gametime / 0.2)))
			const randy = new Randy(Randy.seed(state.seed + Math.floor(tick.gametime / 3)))
			const n = (x: number) => (x * 2) - 1
			const r = () => randy.random()
			const bell = () => {
				let rand = 0
				for (let i = 0; i < 6; i++)
					rand += randy.random()
				return rand / 6
			}

			state.intent.amble = [
				randy.roll(3 / 4)
					? 0
					: n(bell()),
				clamp(Math.abs(n(r())) + n(r())),
			]

			state.intent.glance[0] = n(r()) / 100
			state.gimbal[1] = molasses(10, state.gimbal[1], bell())

			const speedroll = r()
			state.intent.fast = speedroll > 0.7
			state.intent.slow = speedroll < 0.1

			state.stance = randy.roll(0.9)
				? "stand"
				: "crouch"

			state.intent.attack = fastrandy.roll(1 / 20)
			state.intent.jump = fastrandy.roll(1 / 20)
		})
])

