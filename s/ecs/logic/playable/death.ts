
import {behavior, system} from "../../hub.js"
import {Health, SpawnIntent} from "../../schema/schema.js"

export const death = system("death", ({world, realm}) => [

	behavior("without health, you die")
		.select({Health})
		.logic(tick => {

			// const query = world.query({SpawnIntent})

			// for (const entity of query.matches)
			// 	entity.assign

			return entity => {
				if (entity.components.health <= 0)
					entity.dispose()
			}
		}),
])

