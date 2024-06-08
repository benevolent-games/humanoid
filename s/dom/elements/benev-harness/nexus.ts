
import {Nexus, Context} from "@benev/slate"

import {theme} from "../../theme.js"
import {QualityMachine} from "../../../models/quality/quality-machine.js"

export const hnexus = new Nexus(new class extends Context {
	theme = theme
	qualityMachine = new QualityMachine(localStorage)
})

