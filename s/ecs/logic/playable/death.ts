
import {behavior, system} from "../../hub.js"
import {Health} from "../../schema/schema.js"

export const death = system("death", () => [
	behavior("without health, you die")
		.select({Health})
		.logic(() => {
			return entity => {
				if (entity.components.health <= 0)
					entity.dispose()
			}
		}),
])

