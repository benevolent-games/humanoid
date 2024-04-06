
import {system, responder} from "../hub.js"
import {Children, Parent} from "../components/plain_components.js"

export const parenting = system("parenting", ({world}) => [

	responder("delete children when parent is deleted")
		.select({Children}) // remember, this entity has children (it is the parent)
		.respond(parent => () => {
			for (const child of world.obtain(parent.components.children))
				child.dispose()
		}),

	responder("remove child reference when it's deleted")
		.select({Parent}) // remember, this entity has a parent (it is the child)
		.respond(child => () => {
			const parent = world.get(child.components.parent)
			if (parent.has({Children}))
				parent.components.children = parent.components.children
					.filter(id => id !== child.id)
		}),
])

