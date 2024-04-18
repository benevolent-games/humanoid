
import {Suite, expect} from "cynic"
import {scalar} from "@benev/toolbox"

import {MeleeReport} from "./melee.js"
import {middleOf, quickReport, setupActivity} from "./melee-test-tools/tooling.js"

export default <Suite>{

	"determine current phase": async() => {
		expect(quickReport(middleOf.windup).phase).equals("windup")
		expect(quickReport(middleOf.release).phase).equals("release")
		expect(quickReport(middleOf.recovery).phase).equals("recovery")
	},

	"combo phase": async() => {
		const activity = setupActivity()
		activity.seconds = middleOf.combo
		activity.maneuvers.push({
			technique: "swing",
			comboable: true,
			angle: scalar.radians.from.degrees(90),
		})
		expect(new MeleeReport(activity).phase).equals("combo")
	},

}

