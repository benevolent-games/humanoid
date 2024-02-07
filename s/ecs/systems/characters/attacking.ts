
import {is} from "@benev/slate"
import {behavior, system} from "../../hub.js"
import {AttackPhase, phase_report} from "./attacking/attacks.js"

export const attacking = system("attacking mechanics", () => [

	behavior("initiate attack")
		.select("attackage", "intent")
		.processor(() => () => state => {
			const {intent, attackage} = state

			if (intent.attack && attackage.attack === 0) {
				console.log("start attack")
				state.attackage.attack = 3
				state.attackage.seconds = 0
			}
		}),

	behavior("sustain attack")
		.select("attackage")
		.processor(() => tick => state => {
			state.attackage.seconds += tick.seconds
		}),

	behavior("end attack")
		.select("attackage")
		.processor(() => () => state => {
			const {attackage} = state
			if (attackage.attack !== 0) {
				const report = phase_report(attackage.seconds)
				if (report.phase === AttackPhase.None) {
					console.log("end attack")
					state.attackage.attack = 0
				}
			}
		}),
])

