
import {hub} from "../ecs/hub.js"
import {gamelogic} from "../ecs/logic/gamelogic.js"
import {HumanoidRealm} from "../models/realm/realm.js"

/**
 * entity component system
 *  - we take a data-driven approach
 *  - all our game logic is composed of small behaviors
 */
export default (realm: HumanoidRealm) => {
	const world = hub.world(realm)
	const executive = hub.executive(realm, world, gamelogic)
	return {world, executive}
}

