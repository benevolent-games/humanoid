
import {HuRealm} from "./models/realm/realm.js"
import {Respawner} from "./models/respawner/respawner.js"
import {LevelSwitcher} from "./models/level_switcher/switcher.js"

export type Game = {
	respawner: Respawner
	levelSwitcher: LevelSwitcher
} & HuRealm

