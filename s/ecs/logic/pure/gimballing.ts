
import {behavior} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Gimbal, SlowGimbal} from "../../schema/schema.js"

export const gimballing = behavior("record previous gimbal")
	.select({Gimbal, SlowGimbal})
	.act(() => c => {
		c.slowGimbal = molasses2d(
			2,
			c.slowGimbal,
			c.gimbal,
		)
	})

