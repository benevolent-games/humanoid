
import {scalar} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {GimbalRig} from "../../schema/hybrids/gimbal_rig.js"
import {Gimbal, Intent, SlowGimbal} from "../../schema/schema.js"

export const freelook = behavior("apply freelook, onto glance and gimbal based on intent")
	.select({Intent, Gimbal, GimbalRig, SlowGimbal})
	.act(() => c => {
		const {gimbal, slowGimbal, intent} = c
		const [gimbalX, gimbalY] = gimbal
		const [glanceX, glanceY] = intent.glance

		const x = gimbalX + glanceX

		// y axis must be doubled compared to x.
		//  - gimbalX and gimbalY are both between 0 and 1.
		//  - gimbalX represents 360 degrees of horizontal rotation.
		//  - gimbalY represents only 180 degrees of vertical rotation.
		//  - therefore, gimbalX packs "double the punch" of gimbalY.
		//  - thus, to compensate, we double our influence on gimbalY.
		const y = gimbalY + (glanceY * 2)

		c.gimbal = [x, scalar.clamp(y)]
		c.slowGimbal = molasses2d(2, slowGimbal, gimbal)
	})

