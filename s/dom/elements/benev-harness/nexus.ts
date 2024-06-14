
import {Nexus, Context, signals} from "@benev/slate"

import {theme} from "../../theme.js"
import type {Game} from "../../../models/realm/types.js"
import {QualityMachine} from "../../../models/quality/quality-machine.js"

export const hnexus = new Nexus(new class extends Context {
	theme = theme
	gameOp = signals.op<Game>()
	qualityMachine = new QualityMachine(localStorage)
})

