
import {behavior, system} from "../../hub.js"
import {Health} from "../../schema/schema.js"

export const death = system("death", [

	behavior("without health, you die")
		.select({Health})
		.act(({world}) => (components, id) => {
			if (components.health <= 0)
				world.deleteEntity(id)
		}),
])

