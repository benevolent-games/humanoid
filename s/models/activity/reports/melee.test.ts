
import {Suite, expect} from "cynic"
import {scalar} from "@benev/toolbox"

import {meleeReport} from "./melee.js"
import {times, quickReport, setupActivity, exampleTimings, quickManeuver} from "./melee-test-tools/tooling.js"

function proximal(a: number, b: number, epsilon: number = 0.01) {
	const diff = Math.abs(a - b)
	return (diff <= epsilon)
}

export default <Suite>{

	"basic phases": async() => {
		expect(quickReport(times.windupMiddle).maneuver.phase).equals("windup")
		expect(quickReport(times.releaseMiddle).maneuver.phase).equals("release")
		expect(quickReport(times.recoveryMiddle).maneuver.phase).equals("recovery")
	},

	"combo phase": async() => {
		const activity = setupActivity()
		activity.seconds = times.comboMiddle
		activity.maneuvers.push({
			technique: "swing",
			comboable: true,
			angle: scalar.radians.from.degrees(90),
		})
		expect(meleeReport(activity).maneuver.phase).equals("combo")
	},

	normal: {
		"normal almost done": async() => {
			expect(quickReport(times.recoveryEarly).almostDone).equals(false)
			expect(quickReport(times.recoveryLate).almostDone).equals(true)
		},
		"normal done": async() => {
			expect(quickReport(times.recoveryLate).done).equals(false)
			expect(quickReport(times.recoveryEnd).done).equals(true)
		},
	},

	feints: {
		"detect feint": async() => {
			const activity = setupActivity()
			activity.cancelled = exampleTimings.windup * 0.2
			activity.seconds = exampleTimings.windup * 0.3
			const report = meleeReport(activity)
			expect(report.procedure).equals("feint")
			if (report.procedure === "feint") {
				expect(proximal(report.feintProgress, 0.5)).ok()
			}
		},
		"combo feint": async() => {
			console.log("------------------")
			const activity = setupActivity()
			activity.maneuvers.push(quickManeuver())
			activity.cancelled = times.releaseEnd + (exampleTimings.combo * 0.2)
			activity.seconds = times.releaseEnd + (exampleTimings.combo * 0.3)
			const report = meleeReport(activity)
			expect(report.procedure).equals("feint")
			if (report.procedure === "feint") {
				console.log(report.feintProgress)
				expect(proximal(report.feintProgress, 0.5)).ok()
			}
			console.log("------------------2")
		},
		"done and almostDone": async() => {
			const setup = (a: number, b: number) => {
				const activity = setupActivity()
				activity.cancelled = exampleTimings.windup * a
				activity.seconds = exampleTimings.windup * b
				return meleeReport(activity)
			}

			expect(setup(.1, .15).done).equals(false)
			expect(setup(.1, .20).done).equals(true)
			expect(setup(.1, .25).done).equals(true)

			expect(setup(.1, .11).almostDone).equals(false)
			expect(setup(.1, .19).almostDone).equals(true)
			expect(setup(.1, .25).almostDone).equals(true)
		},
		"feint animation": async() => {
			const testAnimProgress = (cancelled: number, seconds: number, expectedWindup: number) => {
				const activity = setupActivity()
				activity.cancelled = cancelled * exampleTimings.windup
				activity.seconds = seconds * exampleTimings.windup
				const {maneuverAnim: {progress, duration}} = meleeReport(activity)
				const expectedProgress = (expectedWindup * exampleTimings.windup) / duration
				console.log({duration, expectedWindup, windup: exampleTimings.windup, progress, expectedProgress})
				expect(proximal(progress, expectedProgress)).ok()
			}
			// console.log("!!!!!!!!!!!!!!")
			// testAnimProgress(.5, .5, .5)
			// testAnimProgress(.5, 1, 0)
			//
			// expect(nearby(
			// 	animProgress(.5, .5),
			// 	expectedWindup(.5),
			// 	epsilon
			// )).ok()
			// expect(nearby(
			// 	animProgress(.5, .4),
			// 	expectedWindup(.1),
			// 	epsilon,
			// )).ok()
		},
	},

	bounces: {
		"detect bounce": async() => {
			const setup = (cancelled: number, seconds: number) => {
				const activity = setupActivity()
				activity.cancelled = exampleTimings.release * cancelled
				activity.seconds = exampleTimings.release * seconds
				return meleeReport(activity)
			}
			expect(setup(.5, .5).procedure).equals("bounce")
			expect(setup(.5, .6).procedure).equals("bounce")
			expect(setup(.5, 1).procedure).equals("bounce")
		},
		// "detect bounce in second maneuver": async() => {
		// 	const setup = (cancelled: number, seconds: number) => {
		// 		const activity1 = setupActivity()
		// 		activity1.maneuvers.push(quickManeuver())
		// 		const duration = meleeReport(activity1).maneuver.duration

		// 		const activity = setupActivity()
		// 		activity.maneuvers.push(quickManeuver())
		// 		activity.cancelled = duration + (exampleTimings.release * cancelled)
		// 		activity.seconds = duration + (exampleTimings.release * seconds)
		// 		return meleeReport(activity)
		// 	}
		// 	expect(setup(.5, .6).maneuver.phase).equals("release")
		// 	expect(setup(.5, .6).procedure).equals("bounce")
		// },
	},
}

