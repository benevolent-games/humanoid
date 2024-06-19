
import {Bestorage} from "@benev/toolbox"

import {HuRealm} from "./realm.js"
import {World} from "../../ecs/hub.js"
import {LevelLoader} from "../levels/loader.js"
import {HuBestorageData} from "../../dom/elements/benev-humanoid/menus/effects.js"

export type Game = {
	world: World
	levelLoader: LevelLoader
	bestorage: Bestorage<HuBestorageData>
} & HuRealm

