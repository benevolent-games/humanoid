
import {Health} from "../../schema/schema.js"
import {behavior, system} from "../../hub.js"

export const death = system("death", [

	behavior("without health, you die")
		.select({Health})
		.logic(({world, realm}) => {
			const query = world.query({})
			return _tick => entity => {
				if (entity.components.health <= 0)
					entity.dispose()
			}
		}),
])

