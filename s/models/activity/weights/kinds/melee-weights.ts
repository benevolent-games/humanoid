
import {Vec2, scalar, spline} from "@benev/toolbox"

import {ActivityWeights, AnimMoment} from "../utils/types.js"
import {zeroWeights} from "../utils/zero-weights.js"
import {combineWeights} from "../utils/combine-weights.js"
import {Angles, Maneuver} from "../../../activity/exports.js"
import {MeleeReport} from "../../reports/melee/parts/types.js"

// export function meleeWeights({activity}: MeleeReport) {
// 	const {cancelled} = activity
// 	const {phase, maneuver} = new MeleeReport(activity)
// 	const {seconds} = maneuver
// 	const {windup, release, combo, recovery} = maneuver.current.technique === "swing"
// 		? activity.weapon.swing.timing
// 		: activity.weapon.stab.timing

// 	const isFirstManeuver = maneuver.index === 0

// 	const reconcile = phase === "combo"
// 		? combo
// 		: recovery

// 	// bounce back on early recovery
// 	const bounciness = 1 / 3
// 	const bouncySeconds = (
// 		cancelled === null
// 			? seconds
// 			: scalar.bottom(cancelled - ((seconds - cancelled) * bounciness), 0)
// 	)

// 	if (isFirstManeuver) {
// 		const a = 0
// 		const b = windup / 3
// 		const c = windup
// 		const d = windup + release
// 		const e = windup + release + reconcile

// 		const weights = maneuverWeights({
// 			maneuver: maneuver.current,
// 			active: cancelled !== null
// 				? spline.linear(seconds - cancelled, [
// 					[0, 1],
// 					[reconcile, 0],
// 				])
// 				: spline.linear(seconds, [
// 					[a, 0],
// 					[b, 1],
// 					[c, 1],
// 					[d, 1],
// 					[e, 0],
// 				]),
// 			progress: spline.linear(bouncySeconds, [
// 				[a, 0 / 3],
// 				[c, 1 / 3],
// 				[d, 2 / 3],
// 				[e, 3 / 3],
// 			]),
// 		})

// 		if (maneuver.next) {
// 			const nextWeights = maneuverWeights({
// 				maneuver: maneuver.next,
// 				active: cancelled !== null
// 					? spline.linear(seconds - cancelled, [
// 						[0, 1],
// 						[reconcile, 0],
// 					])
// 					: spline.linear(seconds, [
// 						[a, 0],
// 						[b, 0],
// 						[c, 0],
// 						[d, 0],
// 						[e, 1],
// 					]),
// 				progress: 1 / 3,
// 			})
// 			return combineWeights(weights, nextWeights)
// 		}

// 		return weights
// 	}
// 	else {
// 		const a = 0
// 		const b = release
// 		const c = release + reconcile

// 		const weights = maneuverWeights({
// 			maneuver: maneuver.current,
// 			active: cancelled !== null
// 				? spline.linear(seconds - cancelled, [
// 					[0, 1],
// 					[reconcile, 0],
// 				])
// 				: spline.linear(seconds, [
// 					[a, 1],
// 					[b, 1],
// 					[c, 0],
// 				]),
// 			progress: spline.linear(bouncySeconds, [
// 				[a, 1 / 3],
// 				[b, 2 / 3],
// 				[c, 3 / 3],
// 			]),
// 		})

// 		if (maneuver.next) {
// 			const nextWeights = maneuverWeights({
// 				maneuver: maneuver.next,
// 				active: cancelled !== null
// 					? spline.linear(seconds - cancelled, [
// 						[0, 1],
// 						[reconcile, 0],
// 					])
// 					: spline.linear(seconds, [
// 						[a, 0],
// 						[b, 0],
// 						[c, 1],
// 					]),
// 				progress: spline.linear(bouncySeconds, [
// 					[a, 0 / 3],
// 					[b, 0 / 3],
// 					[c, 1 / 3],
// 				]),
// 			})
// 			return combineWeights(weights, nextWeights)
// 		}
// 		else return weights
// 	}
// }

export function meleeWeights(report: MeleeReport): ActivityWeights {
	return zeroWeights()
}

//////////////////////////

export function maneuverWeights({maneuver, progress, active}: {
		maneuver: Maneuver.Any
		progress: number
		active: number
	}) {
	const weights = zeroWeights()
	weights.active = active
	if (maneuver.technique === "stab") {
		weights.a7 = {progress, weight: weights.active}
		// if (maneuver.angle < 0)
		// 	weights.a7 = {progress, weight: weights.active}
		// else
		// 	weights.a8 = {progress, weight: weights.active}
	}
	else if (maneuver.technique === "swing") {
		const {angle} = maneuver
		const {splines} = Angles
		const calc = (moment: AnimMoment, points: Vec2[]) => {
			const weight = spline.linear(angle, points) * weights.active
			moment.weight = weight
			if (weight > (1 / 100))
				moment.progress = progress
			return moment
		}
		weights.a1 = calc(weights.a1, splines.a1)
		weights.a2 = calc(weights.a2, splines.a2)
		weights.a3 = calc(weights.a3, splines.a3)
		weights.a4 = calc(weights.a4, splines.a4)
		weights.a5 = calc(weights.a5, splines.a5)
		weights.a6 = calc(weights.a6, splines.a6)
	}
	return weights
}

