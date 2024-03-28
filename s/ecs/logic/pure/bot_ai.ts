
import {Noise, scalar} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {molasses, molasses2d} from "../../../tools/molasses.js"
import {Ai, Bot, Gimbal, Intent, MeleeIntent, Seed, Stance} from "../../schema/schema.js"

const noise = Noise.seed(1)
const {clamp, center, magnify, radians: {from: {degrees}}} = scalar

export const bot_ai = system("bot ai", () => [

	behavior("random dumb wandering")
		.select({Bot, Intent, Ai, Seed, Stance, Gimbal, MeleeIntent})
		.logic(tick => ({components}) => {
			let count = 0

			function sample(scale = 1) {
				return noise.sample(
					scale * tick.gametime,
					(components.seed + count++) * 100,
				)
			}

			const strafe = center(sample())
			const walk = clamp(
				(sample(sample(1 / 10)) * 0.8) +
				center(sample(1 / 3))
			)

			components.intent.amble = molasses2d(20, components.intent.amble, [strafe, walk])
			components.intent.glance[0] = center(sample(3 / 10)) / 10

			const vertical = scalar.map(magnify(sample(1 / 10)), [degrees(-90), degrees(90)])
			components.gimbal[1] = molasses(10, components.gimbal[1], vertical)

			const speedroll = sample(1 / 10)
			components.intent.fast = speedroll > 0.7
			components.intent.slow = speedroll < 0.1

			components.stance = sample(1 / 10) < 0.8
				? "stand"
				: "crouch"

			const m = sample(3)
			const a = 0.3
			components.meleeIntent.stab = scalar.within(m, a * (0/3), a * (1/3))
			components.meleeIntent.swing = scalar.within(m, a * (1/3), a * (2/3))
			components.meleeIntent.parry = scalar.within(m, a * (2/3), a * (3/3))

			components.intent.jump = sample(3) < 0.1
		}),
])

