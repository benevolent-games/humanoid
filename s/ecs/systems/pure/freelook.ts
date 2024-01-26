
import {behavior} from "../../hub.js"
import {scalar} from "@benev/toolbox"

export const freelook = behavior("freelook")
	.select("intent", "gimbal")
	.processor(() => () => state => {

	const [gimbalX, gimbalY] = state.gimbal
	const [glanceX, glanceY] = state.intent.glance

	const x = gimbalX + glanceX

	// y axis must be doubled compared to x.
	//  - gimbalX and gimbalY are both between 0 and 1.
	//  - gimbalX represents 360 degrees of horizontal rotation.
	//  - gimbalY represents only 180 degrees of vertical rotation.
	//  - therefore, gimbalX packs "double the punch" of gimbalY.
	//  - thus, to compensate, we double our influence on gimbalY.
	const y = gimbalY + (glanceY * 2)

	state.gimbal = [
		scalar.wrap(x),
		scalar.clamp(y),
	]
})

