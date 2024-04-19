
import {Vec2, scalar, spline} from "@benev/toolbox"

import {ActivityWeights, AnimMoment} from "../utils/types.js"
import {zeroWeights} from "../utils/zero-weights.js"
import {combineWeights} from "../utils/combine-weights.js"
import {Angles, Maneuver} from "../../../activity/exports.js"
import {MeleeReport} from "../../reports/melee/parts/types.js"

const blend = 0.1

export function meleeWeights(melee: MeleeReport): ActivityWeights {
	const {predicament} = melee
	const {chart, phase, progress, next, time, duration} = melee.predicament.animatedManeuver
	const {comboIn} = chart
	const {windup, release} = chart.timing
	const reconcile = phase === "combo"
		? chart.timing.combo
		: chart.timing.recovery

	const alphaWeights = generate_attack_weights({
		maneuver: chart.maneuver,
		progress: comboIn
			? scalar.remap(progress, [0, 1], [1/3, 1])
			: progress,
		active: (
			predicament.procedure === "normal" ? spline.linear(time, comboIn ? [
				[0, 1],
				[release, 1],
				[release + reconcile, 0],
			] : [
				[0, 0],
				[blend, 1],
				[windup + release, 1],
				[windup + release + reconcile, 0],
			]) :
			predicament.procedure === "feint" ? spline.linear(predicament.feintProgress, [
				[0.0, 1],
				[0.5, 1],
				[1.0, 0],
			]) :
			predicament.procedure === "bounce" ? spline.linear(predicament.bounceProgress, [
				[0.0, 1],
				[1.0, 0],
			]) :
			0
		),
	})

	if (next) {
		const bravoWeights = generate_attack_weights({
			maneuver: next.maneuver,
			progress: 1 / 3, // frozen in windup
			active: predicament.procedure === "normal"
				? spline.linear(time, comboIn ? [
					[0, 0],
					[release, 0],
					[release + reconcile, 1],
				] : [
					[0, 0],
					[windup + release, 0],
					[windup + release + reconcile, 1],
				])
				: 0,
		})

		return combineWeights(alphaWeights, bravoWeights)
	}

	return alphaWeights
}

//////////////////////////

export function generate_attack_weights({maneuver, progress, active}: {
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

