
import {scalar} from "@benev/toolbox"
import {Executive} from "@benev/toolbox/x/ecs6/exe/executive.js"

import {HumanoidTick} from "../ecs/hub.js"
import {HumanoidRealm} from "../models/realm/realm.js"

export default (realm: HumanoidRealm, executive: Executive<HumanoidRealm, HumanoidTick>) => {

	//
	// start the game
	//  - render loop
	//  - physics loop
	//  - game tick loop
	//

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

		const tick: HumanoidTick = {
			seconds,
			gametime,
			count: count++,
			hz: 1 / seconds,
		}

		executive.execute(tick)
	})

	realm.stage.gameloop.start()
}
