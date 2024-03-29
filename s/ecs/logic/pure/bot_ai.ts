
import {Noise, scalar} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {molasses, molasses2d} from "../../../tools/molasses.js"
import {Ai, Bot, Gimbal, Intent, MeleeIntent, Seed, Stance} from "../../schema/schema.js"

const noise = Noise.seed(1)
const {clamp, center, magnify, radians: {from: {degrees}}} = scalar

export const bot_ai = system("bot ai", [

	behavior("random dumb wandering")
		.select({Bot, Intent, Ai, Seed, Stance, Gimbal, MeleeIntent})
		.act(({tick}) => state => {
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
			state.intent.glance[0] = center(sample(3 / 10)) / 10

			const vertical = scalar.map(magnify(sample(1 / 10)), [degrees(-90), degrees(90)])
			state.gimbal[1] = molasses(10, state.gimbal[1], vertical)

			const speedroll = sample(1 / 10)
			state.intent.fast = speedroll > 0.7
			state.intent.slow = speedroll < 0.1

			state.stance = sample(1 / 10) < 0.8
				? "stand"
				: "crouch"

			const m = sample(3)
			const a = 0.3
			state.meleeIntent.stab = scalar.within(m, a * (0/3), a * (1/3))
			state.meleeIntent.swing = scalar.within(m, a * (1/3), a * (2/3))
			state.meleeIntent.parry = scalar.within(m, a * (2/3), a * (3/3))

			state.intent.jump = sample(3) < 0.1
		}),
])

