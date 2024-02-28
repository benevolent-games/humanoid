
import {Game} from "./types.js"
import {theme} from "./dom/theme.js"
import {Nexus, Context, signals} from "@benev/slate"

export const nexus = new Nexus(new class extends Context {
	theme = theme
	gameOp = signals.op<Game>()
})

