
import {scalar} from "@benev/toolbox"
import {Executive} from "@benev/toolbox/x/ecs6/exe/executive.js"

import {HuTick} from "../ecs/hub.js"
import {HuRealm} from "../models/realm/realm.js"

/**
 * start the game
 *  - render loop
 *  - physics loop
 *  - game tick loop
 */
export default (
		realm: HuRealm,
		executive: Executive<HuRealm, HuTick>,
	) => {

	let count = 0
	let gametime = 0
	let last_time = performance.now()

	realm.stage.gameloop.onTick(() => {
		const last = last_time
		realm.physics.step()

		const seconds = scalar.clamp(
			((last_time = performance.now()) - last),
			0,
			1000 / 30, // clamp delta to avoid large over-corrections
		) / 1000

		gametime += seconds

		const tick: HuTick = {
			seconds,
			gametime,
			count: count++,
			hz: 1 / seconds,
		}

		executive.execute(tick)
	})

	realm.stage.gameloop.start()
}
