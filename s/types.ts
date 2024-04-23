
import {Bestorage} from "@benev/toolbox"

import {HuRealm} from "./models/realm/realm.js"
import {LevelLoader} from "./models/level_loader/loader.js"
import {HuBestorageData} from "./dom/elements/benev-humanoid/menus/effects.js"

export type Game = {
	levelLoader: LevelLoader
	bestorage: Bestorage<HuBestorageData>
} & HuRealm

