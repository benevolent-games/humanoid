
import {system, responder} from "../hub.js"
import {Children} from "../components/plain_components.js"

export const parenting = system("parenting", ({world}) => [
	responder("delete orphans")
		.select({Children})
		.respond(parent => () => {
			for (const child of world.obtain(parent.components.children))
				child.dispose()
		}),
])

