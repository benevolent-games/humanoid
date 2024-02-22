
import {scalar} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {Gimbal, Intent} from "../../schema/schema.js"
import {GimbalRig} from "../../schema/hybrids/gimbal_rig.js"

export const freelook = behavior("apply freelook, onto glance and gimbal based on intent")
	.select({Intent, Gimbal, GimbalRig})
	.act(() => c => {
		const [gimbalX, gimbalY] = c.gimbal
		const [glanceX, glanceY] = c.intent.glance

		const x = gimbalX + glanceX

		// y axis must be doubled compared to x.
		//  - gimbalX and gimbalY are both between 0 and 1.
		//  - gimbalX represents 360 degrees of horizontal rotation.
		//  - gimbalY represents only 180 degrees of vertical rotation.
		//  - therefore, gimbalX packs "double the punch" of gimbalY.
		//  - thus, to compensate, we double our influence on gimbalY.
		const y = gimbalY + (glanceY * 2)

		c.gimbal = [scalar.wrap(x), scalar.clamp(y)]
	})

