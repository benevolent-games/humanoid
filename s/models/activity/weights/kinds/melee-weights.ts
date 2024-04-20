
import {Vec2, scalar, spline} from "@benev/toolbox"

import {zeroWeights} from "../utils/zero-weights.js"
import {combineWeights} from "../utils/combine-weights.js"
import {Angles, Maneuver} from "../../../activity/exports.js"
import {ActivityWeights, AnimMoment} from "../utils/types.js"
import {ManeuverPhase, MeleeReport} from "../../reports/melee/parts/types.js"

const blend = 0.1

export function meleeWeights(melee: MeleeReport): ActivityWeights {
	const {flow} = melee
	const {chart, phase, phaseProgress, next, time} = melee.flow.animSnapshot
	const {comboIn} = chart
	const {windup, release} = chart.timing
	const reconcile = phase === "combo"
		? chart.timing.combo
		: chart.timing.recovery

	const alphaWeights = generate_attack_weights({
		maneuver: chart.maneuver,
		attackAnimProgress: (
			derive_attack_anim_progress_from_phase(phase, phaseProgress)
		),
		active: (
			flow.procedure === "normal" ? spline.linear(time, comboIn ? [
				[0, 1],
				[release, 1],
				[release + reconcile, 0],
			] : [
				[0, 0],
				[blend, 1],
				[windup + release, 1],
				[windup + release + reconcile, 0],
			]) :
			flow.procedure === "feint" ? spline.linear(flow.feintProgress, [
				[0.0, 1],
				[0.5, 1],
				[1.0, 0],
			]) :
			flow.procedure === "bounce" ? spline.linear(flow.bounceProgress, [
				[0.0, 1],
				[1.0, 0],
			]) :
			0
		),
	})

	if (next) {
		const bravoWeights = generate_attack_weights({
			maneuver: next.maneuver,
			attackAnimProgress: 1 / 3, // frozen in windup
			active: flow.procedure === "normal"
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

export function derive_attack_anim_progress_from_phase(
		phase: ManeuverPhase,
		phaseProgress: number,
	) {
	switch (phase) {
		case "windup":
			return scalar.map(phaseProgress, [0/3, 1/3])

		case "release":
			return scalar.map(phaseProgress, [1/3, 2/3])

		case "combo":

			// // this is technically-mathematically more correct
			// return 2/3 // hold at release-end

			// but this yields a more natural-looking result
			return scalar.map(phaseProgress, [2/3, 3/3])

		case "recovery":
			return scalar.map(phaseProgress, [2/3, 3/3])
	}
}

export function generate_attack_weights({
		maneuver, attackAnimProgress, active,
	}: {
		maneuver: Maneuver.Any
		attackAnimProgress: number
		active: number
	}) {

	const weights = zeroWeights()
	weights.active = active

	if (maneuver.technique === "stab") {
		weights.a7 = {weight: weights.active, progress: attackAnimProgress}
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
				moment.progress = attackAnimProgress
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

