
import {scalar} from "@benev/toolbox"
import {Suite, assert, expect} from "cynic"

import {Feint, meleeReport} from "./melee2.js"
import {setupActivity, quickManeuver, quickReport} from "./melee-test-tools/tooling.js"

function proximal(a: number, b: number, epsilon: number = 0.01) {
	const diff = Math.abs(a - b)
	return (diff <= epsilon)
}

export default <Suite>{

	"basic phases": async() => {
		expect(quickReport(0.5).activeManeuver.phase)
			.equals("windup")
		expect(quickReport(1.5).activeManeuver.phase)
			.equals("release")
		expect(quickReport(2.5).activeManeuver.phase)
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
		expect(meleeReport(activity).activeManeuver.phase).equals("combo")
	},

	normal: {
		"normal predicament": async() => {
			expect(quickReport(2.1).predicament.procedure).equals("normal")
		},
		"normal almost done": async() => {
			expect(quickReport(2.1).predicament.almostDone).equals(false)
			expect(quickReport(2.9).predicament.almostDone).equals(true)
		},
		"normal done": async() => {
			expect(quickReport(2.1).predicament.done).equals(false)
			expect(quickReport(3).predicament.done).equals(true)
		},
	},

	feints: (() => {
		function feint(cancelled: number, seconds: number) {
			const activity = setupActivity()
			activity.cancelled = cancelled
			activity.seconds = seconds
			const predicament = meleeReport(activity).predicament as Feint
			expect(predicament.procedure).equals("feint")
			return predicament
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
			"feint almostDone": async() => {
				expect(feint(.4, .41).almostDone).equals(false)
				expect(feint(.4, .79).almostDone).equals(true)
			},
			"feint combo": async() => {
				const activity = setupActivity()
				activity.cancelled = 2.4
				activity.seconds = 2.6
				activity.maneuvers.push(quickManeuver())
				const predicament = meleeReport(activity).predicament as Feint
				expect(predicament.procedure).equals("feint")
				assert(proximal(predicament.feintDuration, .4))
			},
		}
	})(),
}

