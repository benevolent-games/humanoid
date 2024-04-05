
import {scalar} from "@benev/toolbox"

import {HuTick} from "../ecs/hub.js"
import {HuRealm} from "../models/realm/realm.js"

/**
 * start the gameloop, to execute physics and game logic.
 */
export default (
		{stage, physics}: HuRealm,
		executeGamelogic: (tick: HuTick) => void,
	) => {

	let count = 0
	let gametime = 0

	stage.gameloop.beforeRender(ms => {
		ms = scalar.top(ms, 1000 / 10)
		const seconds = ms / 1000
		gametime += seconds

		physics.step(seconds)

		executeGamelogic({
			seconds,
			gametime,
			count: count++,
			hz: 1 / seconds,
		})
	})

	stage.gameloop.start()
}

