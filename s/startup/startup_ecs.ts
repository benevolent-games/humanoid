
import {hub} from "../ecs/hub.js"
import {Execute} from "../types.js"
import {HuRealm} from "../models/realm/realm.js"
import {gamelogic, logic_after_anims} from "../ecs/gamelogic.js"

/**
 * entity component system
 *  - we take a data-driven approach
 *  - all our game logic is composed of small behaviors
 */
export default (realm: HuRealm) => {
	const world = hub.world(realm)
	const basis = {realm, world}
	const execute: Execute = {
		gamelogic: gamelogic.prepareExecutor(basis),
		after_anims: logic_after_anims.prepareExecutor(basis),
	}
	return {world, execute}
}

