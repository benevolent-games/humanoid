
import {Execute} from "../types.js"
import {HuTick} from "../ecs/hub.js"
import {HuRealm} from "../models/realm/realm.js"

/**
 * start the gameloop, to execute physics and game logic.
 */
export default (
		{stage, physics}: HuRealm,
		execute: Execute
	) => {

	const tick: HuTick = {
		count: 0,
		seconds: 0,
		gametime: 0,
		hz: 0,
	}

	stage.gameloop.on(ms => {
		tick.count++
		tick.seconds = ms / 1000
		tick.gametime += tick.seconds
		tick.hz = 1 / tick.seconds
	})

	stage.gameloop.on(() => {
		physics.step(tick.seconds)
		execute.gamelogic(tick)
	})

	stage.scene.onAfterAnimationsObservable.add(() => execute.after_anims(tick))

	stage.gameloop.start()
}

