
import {ob} from "@benev/slate"
import {World} from "../ecs/hub.js"
import {gamelogic} from "../ecs/gamelogic.js"
import {HuRealm} from "../models/realm/realm.js"

export default (realm: HuRealm, world: World) => {
	return ob(gamelogic).map(s => s.prepareExecutor({realm, world}))
}

