
import {scalar, spline} from "@benev/toolbox"
import {zeroWeights} from "../kit/zero-weights.js"
import {Angles, Maneuver} from "../../../activity/exports.js"
import {combineWeights} from "../kit/combine-weights.js"
import {MeleeReport} from "../../../activity/reports/melee.js"
import {ActivityWeights} from "../kit/weights.js"

export function meleeWeights({activity}: MeleeReport) {
	const {cancelled} = activity
	const {phase, maneuver} = new MeleeReport(activity)
	const {seconds} = maneuver
	const {windup, release, combo, recovery} = maneuver.current.technique === "swing"
		? activity.weapon.swing.timing
		: activity.weapon.stab.timing

	const isComboContinuation = maneuver.index > 0

	// bounce back on early recovery
	const bounciness = 1 / 3
	const bouncySeconds = (
		cancelled === null
			? seconds
			: scalar.bottom(cancelled - ((seconds - cancelled) * bounciness), 0)
	)

	if (isComboContinuation) {
		const a = 0
		const b = release
		const c = release + (phase === "combo" ? combo : recovery)

		const weights = maneuverWeights({
			maneuver: maneuver.current,
			active: cancelled !== null
				? spline.linear(seconds - cancelled, [
					[0, 1],
					[recovery, 0],
				])
				: spline.linear(seconds, [
					[a, 1],
					[b, 1],
					[c, 0],
				]),
			progress: spline.linear(bouncySeconds, [
				[a, 1 / 3],
				[b, 2 / 3],
				[c, 3 / 3],
			]),
		})

		if (maneuver.next) {
			const nextWeights = maneuverWeights({
				maneuver: maneuver.next,
				active: cancelled !== null
					? spline.linear(seconds - cancelled, [
						[0, 1],
						[recovery, 0],
					])
					: spline.linear(seconds, [
						[a, 0],
						[b, 0],
						[c, 1],
					]),
				progress: spline.linear(bouncySeconds, [
					[a, 0 / 3],
					[b, 0 / 3],
					[c, 1 / 3],
				]),
			})
			return combineWeights(weights, nextWeights)
		}
		else return weights
	}
	else {
		const a = 0
		const b = windup / 3
		const c = windup
		const d = windup + release
		const e = windup + release + (phase === "combo" ? combo : recovery)

		const weights = maneuverWeights({
			maneuver: maneuver.current,
			active: cancelled !== null
				? spline.linear(seconds - cancelled, [
					[0, 1],
					[recovery, 0],
				])
				: spline.linear(seconds, [
					[a, 0],
					[b, 1],
					[c, 1],
					[d, 1],
					[e, 0],
				]),
			progress: spline.linear(bouncySeconds, [
				[a, 0 / 3],
				[c, 1 / 3],
				[d, 2 / 3],
				[e, 3 / 3],
			]),
		})

		// if (maneuver.next) {
		// 	const nextWeights = maneuverWeights({
		// 		maneuver: maneuver.next,
		// 		active: cancelled !== null
		// 			? spline.linear(seconds - cancelled, [
		// 				[0, 1],
		// 				[recovery, 0],
		// 			])
		// 			: spline.linear(seconds, [
		// 				[a, 0],
		// 				[b, 0],
		// 				[c, 0],
		// 				[d, 0],
		// 				[e, 1],
		// 			]),
		// 		progress: spline.linear(bouncySeconds, [
		// 			[a, 0 / 3],
		// 			[c, 0 / 3],
		// 			[d, 0 / 3],
		// 			[e, 1 / 3],
		// 		]),
		// 	})
		// 	const w = combineWeights(weights, nextWeights)
		// 	return w
		// }

		return weights
	}
}

//////////////////////////

function maneuverWeights({maneuver, progress, active}: {
		maneuver: Maneuver.Any
		progress: number
		active: number
	}) {
	const weights = zeroWeights()
	weights.active = active
	weights.inactive = scalar.inverse(active)
	if (maneuver.technique === "stab") {
		if (maneuver.angle < 0)
			weights.a7 = {progress, weight: weights.active}
		else
			weights.a8 = {progress, weight: weights.active}
	}
	else if (maneuver.technique === "swing") {
		const {angle} = maneuver
		const {splines} = Angles
		weights.a1 = {progress, weight: spline.linear(angle, splines.a1) * weights.active}
		weights.a2 = {progress, weight: spline.linear(angle, splines.a2) * weights.active}
		weights.a3 = {progress, weight: spline.linear(angle, splines.a3) * weights.active}
		weights.a4 = {progress, weight: spline.linear(angle, splines.a4) * weights.active}
		weights.a5 = {progress, weight: spline.linear(angle, splines.a5) * weights.active}
		weights.a6 = {progress, weight: spline.linear(angle, splines.a6) * weights.active}
	}
	return weights
}

