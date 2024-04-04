
import {vec3} from "@benev/toolbox"
import {behavior} from "../hub.js"
import {Position, PreviousPosition, Velocity} from "../schema/schema.js"

export const velocity = behavior("calculate velocity")
	.select({Position, Velocity, PreviousPosition})
	.logic(() => ({components: c}) => {
		c.velocity = vec3.subtract(c.position, c.previousPosition)
		c.previousPosition = c.position
	})

