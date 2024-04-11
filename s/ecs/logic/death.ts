
import {scalar} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {Health} from "../components/topics/warrior.js"

const bleed_per_second = 3 / 100

export const death = system("death", () => [

	behavior("bleeding drains your hp")
		.select({Health})
		.logic(tick => ({components: {health}}) => {
			if (health.bleed > 0) {
				const loss = scalar.top(bleed_per_second * tick.seconds, health.bleed)
				health.hp -= loss
				health.bleed -= loss
			}
		}),

	behavior("without health, you die")
		.select({Health})
		.logic(() => entity => {
			if (entity.components.health.hp < 0)
				entity.dispose()
		}),
])

