
import {scalar} from "@benev/toolbox"
import {Suite, assert, expect} from "cynic"

import {MeleeFlow} from "./parts/types.js"
import {meleeReport} from "./melee-report.js"
import {setupActivity, quickReport} from "./testing/tooling.js"

function proximal(a: number, b: number, epsilon: number = 0.01) {
	const diff = Math.abs(a - b)
	return (diff <= epsilon)
}

export default <Suite>{

	"basic phases": async() => {
		expect(quickReport(0.5).logicalSnapshot.phase)
			.equals("windup")
		expect(quickReport(1.5).logicalSnapshot.phase)
			.equals("release")
		expect(quickReport(2.5).logicalSnapshot.phase)
			.equals("recovery")
	},

	"combo phase": async() => {
		const activity = setupActivity()
		activity.seconds = 2.5
		activity.maneuvers.push({
			technique: "swing",
			comboable: true,
			angle: scalar.radians.from.degrees(90),
		})
		expect(meleeReport(activity).logicalSnapshot.phase).equals("combo")
	},

	normal: {
		"normal flow": async() => {
			expect(quickReport(2.1).flow.procedure).equals("normal")
		},
		"normal done": async() => {
			expect(quickReport(2.1).flow.done).equals(false)
			expect(quickReport(3).flow.done).equals(true)
		},
	},

	feints: (() => {
		function feint(cancelled: number, seconds: number) {
			const activity = setupActivity()
			activity.cancelled = cancelled
			activity.seconds = seconds
			const flow = meleeReport(activity).flow as MeleeFlow.Feint
			expect(flow.procedure).equals("feint")
			return flow
		}
		return {
			"feint duration": async() => {
				assert(proximal(feint(.4, .6).feintDuration, .4))
			},
			"feint time": async() => {
				assert(proximal(feint(.4, .6).feintTime, .2))
			},
			"feint done": async() => {
				expect(feint(.4, .6).done).equals(false)
				expect(feint(.4, .8).done).equals(true)
			},
			// "feint combo": async() => {
			// 	const activity = setupActivity()
			// 	activity.cancelled = 2.4
			// 	activity.seconds = 2.6
			// 	activity.maneuvers.push(quickManeuver())
			// 	const flow = meleeReport(activity).flow as MeleeFlow.Feint
			// 	expect(flow.procedure).equals("feint")
			// 	assert(proximal(flow.feintDuration, .4))
			// },
		}
	})(),
}

