
import {scalar} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {Intent} from "../components/plain_components.js"
import {MeleeAction} from "../components/topics/warrior.js"

const capPerSecond = scalar.radians.from.turns(1)

export const turncaps = system("turncaps", () => [
	behavior("turncaps slow down your aim during melee")
		.select({Intent, MeleeAction})
		.logic(({seconds}) => ({components}) => {
			const {meleeAction: action} = components

			if (Melee.is.attack(action)) {
				const cap = capPerSecond * seconds
				const [x, y] = components.intent.glance

				components.intent.glance = [
					scalar.clamp(x, -cap, cap),
					scalar.clamp(y, -cap, cap),
				]
			}
		}),
])

