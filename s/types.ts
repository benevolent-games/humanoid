
import {HuRealm} from "./models/realm/realm.js"
import {LevelLoader} from "./models/level_loader/loader.js"
import {HuTick} from "./ecs/hub.js"

export type Game = { levelLoader: LevelLoader } & HuRealm

export type ExecuteFn = (tick: HuTick) => void

export type Execute = {
	gamelogic: ExecuteFn
	after_anims: ExecuteFn
}

