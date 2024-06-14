
import {Nexus, Context, signals} from "@benev/slate"

import {theme} from "../../theme.js"
import {make_gameplan} from "../../../gameplan.js"
import type {Game} from "../../../models/realm/types.js"
import {QualityMachine} from "../../../models/quality/quality-machine.js"
import {determine_local_mode} from "../../../tools/determine_local_mode.js"

export const hnexus = new Nexus(new class extends Context {
	theme = theme
	gameOp = signals.op<Game>()
	qualityMachine = new QualityMachine(localStorage)

	gameplan = signals.computed(() => {
		const local = determine_local_mode(location.href)
		return make_gameplan({
			local,
			root_url: "/assets",
			quality: this.qualityMachine.quality,
		})
	})
})

