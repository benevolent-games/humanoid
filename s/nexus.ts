
import {Nexus, Context, signals} from "@benev/slate"

import {theme} from "./dom/theme.js"
import {HumanoidRealm} from "./models/realm/realm.js"

export const nexus = new Nexus(new class extends Context {
	theme = theme

	realmOp = signals.op<HumanoidRealm>()
})

