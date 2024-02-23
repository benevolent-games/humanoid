
import {Nexus, Context, signals} from "@benev/slate"

import {theme} from "./dom/theme.js"
import {HumanoidRealm} from "./models/realm/realm.js"
import {LevelSwitcher} from "./models/level_switcher/switcher.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme

	realmOp = signals.op<HumanoidRealm>()

	zoneOp = signals.op<{
		levelSwitcher: LevelSwitcher
	}>()
})

