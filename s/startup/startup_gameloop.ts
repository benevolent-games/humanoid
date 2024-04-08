
import {ob} from "@benev/slate"
import {HuTick, World} from "../ecs/hub.js"
import {gamelogic} from "../ecs/gamelogic.js"
import {HuRealm} from "../models/realm/realm.js"

/**
 * start the gameloop, to execute physics and game logic.
 */
export default (realm: HuRealm, world: World) => {
	const {stage, physics} = realm
	const executeGamelogic = ob(gamelogic).map(s => s.prepareExecutor({realm, world}))

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

