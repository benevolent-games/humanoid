
import {Weapon} from "../../../armory/weapon.js"
import {Activity, Maneuver} from "../../exports.js"
import {ManeuverPhase, ManeuverQuery, ManeuverChart, MeleeReport, Predicament} from "./parts/types.js"

const bounciness = 1 / 3

export function meleeReport(activity: Activity.Melee): MeleeReport {
	const maneuverReports = generateManeuverReports(
		activity.maneuvers,
		activity.weapon,
	)

	const activeManeuver = queryManeuver(
		maneuverReports,
		activity.cancelled ?? activity.seconds,
	)

	const predicament = ascertainPredicament(
		activity,
		maneuverReports,
		activeManeuver,
	)

	return {
		activity,
		charts: maneuverReports,
		activeManeuver,
		predicament,
		animatedManeuver: predicament.animatedManeuver,
		done: predicament.done,
		almostDone: predicament.almostDone,
	}
}

////////////////////////////////////////////////
////////////////////////////////////////////////

function ascertainPredicament(
		activity: Activity.Melee,
		reports: ManeuverChart[],
		maneuver: ManeuverQuery,
	): Predicament {

	const {seconds, cancelled} = activity
	const wasCancelled = cancelled !== null && seconds >= cancelled

	if (wasCancelled) {
		const since = seconds - cancelled

		// feint predicament
		if (maneuver.phase === "windup" || maneuver.phase === "combo") {
			const phaseStart = calculate_phase_start_in_maneuver_time(
				maneuver.chart.timing,
				maneuver.phase,
				maneuver.chart.comboIn,
			)
			const feintDuration = maneuver.time - phaseStart
			const feintProgress = since / feintDuration
			const rewind = cancelled - since
			return {
				procedure: "feint",
				feintTime: since,
				feintDuration,
				feintProgress,
				done: feintProgress >= 1,
				almostDone: feintProgress >= 0.6,
				animatedManeuver: queryManeuver(reports, rewind),
			}
		}

		// bounce predicament
		else if (maneuver.phase === "release") {
			const bounceDuration = maneuver.chart.timing.recovery / 2
			const bounceProgress = since / bounceDuration
			const augmentedRewind = cancelled - (since * bounciness)
			return {
				procedure: "bounce",
				bounceTime: since,
				bounceDuration,
				bounceProgress,
				done: bounceProgress >= 1,
				almostDone: bounceProgress >= 0.6,
				animatedManeuver: queryManeuver(reports, augmentedRewind),
			}
		}
	}

	// normal predicament
	return {
		procedure: "normal",
		done: maneuver.progress >= 1,
		almostDone: maneuver.progress >= 0.8,
		animatedManeuver: maneuver,
	}
}

function generateManeuverReports(maneuvers: Maneuver.Any[], weapon: Weapon.Loadout) {
	let runningTime = 0
	return maneuvers.map((maneuver, index): ManeuverChart => {
		const {timing} = weapon[maneuver.technique]
		const start = runningTime
		const comboIn = index !== 0
		const comboOut = index < (maneuvers.length - 1)
		const duration = sum_maneuver_duration(timing, comboIn, comboOut)
		runningTime += duration
		return {maneuver, timing, start, duration, comboIn, comboOut}
	})
}

function queryManeuver(charts: ManeuverChart[], seconds: number) {
	let active: ManeuverQuery | null = null
	seconds = Math.max(seconds, 0)

	charts.forEach((chart, index) => {
		const {timing, start, duration, comboIn, comboOut} = chart
		if (seconds >= start) {
			const time = seconds - start
			const phase = calculate_phase(timing, time, comboIn, comboOut)
			const progress = time / duration
			const next = charts.at(index + 1) ?? null
			active = {chart, index, phase, time, duration, progress, next}
		}
	})

	if (!active)
		throw new Error("no active maneuver")

	return active
}

function calculate_phase(
		timing: Weapon.AttackTiming,
		time: number,
		comboIn: boolean,
		comboOut: boolean,
	) {
	const isInitialAttack = !comboIn
	const {windup, release} = timing
	const outro = comboOut ? "combo" : "recovery"
	return isInitialAttack
		? (
			(time < windup) ? "windup" :
			(time < (windup + release)) ? "release" :
			outro
		)
		: (
			time < release ? "release" :
			outro
		)
}

function calculate_phase_start_in_maneuver_time(
		timing: Weapon.AttackTiming,
		phase: ManeuverPhase,
		comboIn: boolean,
	) {

	const {release} = timing
	const maybeWindup = comboIn
		? 0
		: timing.windup

	return (
		phase === "windup" ? 0 :
		phase === "release" ? maybeWindup :
		maybeWindup + release
	)
}

function sum_maneuver_duration(
		timing: Weapon.AttackTiming,
		comboIn: boolean,
		comboOut: boolean,
	) {

	const maybeWindup = comboIn
		? 0
		: timing.windup

	const sum = (
		maybeWindup +
		timing.release +
		(comboOut
			? timing.combo
			: timing.recovery)
	)

	return sum
}

