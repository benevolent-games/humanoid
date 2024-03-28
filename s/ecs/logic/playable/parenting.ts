
import {system, logic} from "../../hub.js"
import {Parenting} from "../utils/parenting.js"
import {Children, Parent} from "../../schema/schema.js"

export const spawning = system("spawning", ({world, realm}) => [

	// logic("parenting", ({world, realm}) => {
	// 	const parenting = new Parenting(world)
	// 	const parents = world.query({Parent})
	// 	const children = world.query({Children})

	// 	parents.onAdded(parent => {})
	// 	parents.onRemoved(parent => {})

	// 	return () => {

	// 	}
	// }),
])

