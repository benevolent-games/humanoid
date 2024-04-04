
import {hub} from "../ecs/hub.js"
import {HuRealm} from "../models/realm/realm.js"
import {gamelogic} from "../ecs/gamelogic.js"

/**
 * entity component system
 *  - we take a data-driven approach
 *  - all our game logic is composed of small behaviors
 */
export default (realm: HuRealm) => {
	const world = hub.world(realm)
	const executor = gamelogic.prepareExecutor({realm, world})
	return {world, executor}
}

