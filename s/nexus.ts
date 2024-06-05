
import {theme} from "./dom/theme.js"
import type {Game} from "./models/realm/types.js"
import {Nexus, Context, signals} from "@benev/slate"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	gameOp = signals.op<Game>()
})

