
import {human, scalar} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {Health} from "../components/topics/warrior.js"

const bleed_per_second = 3 / 100

export const death = system("death", () => [

	behavior("bleeding drains your hp")
		.select({Health})
		.logic(tick => ({components: {health}}) => {
			if (health.bleeding > 0) {
				const loss = scalar.top(bleed_per_second * tick.seconds, health.bleeding)
				health.hp -= loss
				health.bleeding -= loss
				console.log(`bleeding.. ${human.vec([health.hp, health.bleeding])}`)
			}
		}),

	behavior("without health, you die")
		.select({Health})
		.logic(() => entity => {
			if (entity.components.health.hp <= 0)
				entity.dispose()
		}),
])

