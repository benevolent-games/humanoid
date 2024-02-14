
import {behavior, system} from "../../hub.js"
import {Children} from "../../schema/schema.js"
import {Transform} from "../../schema/hybrids/transform.js"

export const parenting = system("parenting", [
	behavior("transforms have camera children")
		.select({Transform, Children})
		.act(({world}) => c => {
			const lol = c.children.map(id => world)
		}),
])
