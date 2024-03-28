
import {HuRealm} from "./models/realm/realm.js"
import {LevelLoader} from "./models/level_loader/loader.js"

export type Game = {
	levelLoader: LevelLoader
} & HuRealm

