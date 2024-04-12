
import {HuTick} from "../ecs/hub.js"
import {HuRealm} from "../models/realm/realm.js"
import startup_gamelogic from "./startup_gamelogic.js"

/**
 * start the gameloop, to execute physics and game logic.
 */
export default (realm: HuRealm, executeGamelogic: ReturnType<typeof startup_gamelogic>) => {
	const {stage, physics} = realm

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
		executeGamelogic.primary(tick)
	})

	stage.scene.onAfterAnimationsObservable.add(() => executeGamelogic.afterAnims(tick))

	stage.gameloop.start()
}

