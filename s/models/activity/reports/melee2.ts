
import {scalar} from "@benev/toolbox"
import {Weapon} from "../../armory/weapon.js"
import {Activity, Maneuver} from "../exports.js"

export type ManeuverPhase = "windup" | "release" | "combo" | "recovery"

export type ManeuverQuery = {
	index: number
	time: number
	progress: number
	phase: ManeuverPhase
	report: ManeuverReport
	next: ManeuverReport | null
}

export type ManeuverReport = {
	start: number
	duration: number
	comboIn: boolean
	comboOut: boolean
	timing: Weapon.AttackTiming
}

export type Normal = {
	procedure: "normal"
	animatedManeuver: ManeuverQuery
	done: boolean
	almostDone: boolean
}

export type Feint = {
	procedure: "feint"
	animatedManeuver: ManeuverQuery
	feintTime: number
	feintDuration: number
	feintProgress: number
	done: boolean
	almostDone: boolean
}

export type Bounce = {
	procedure: "bounce"
	animatedManeuver: ManeuverQuery
	bounceTime: number
	bounceDuration: number
	bounceProgress: number
	done: boolean
	almostDone: boolean
}

export type Predicament = Normal | Feint | Bounce

export type MeleeReport4 = {
	activity: Activity.Melee
	maneuverReports: ManeuverReport[]
	activeManeuver: ManeuverQuery
	predicament: Predicament
}

export function meleeReport(activity: Activity.Melee): MeleeReport4 {
	const maneuverReports = generateManeuverReports(activity.maneuvers, activity.weapon)
	const activeManeuver = queryManeuver(maneuverReports, activity.cancelled ?? activity.seconds)
	const predicament = ascertainPredicament(activity, maneuverReports, activeManeuver)
	return {activity, maneuverReports, activeManeuver, predicament}
}

function ascertainPredicament(
		activity: Activity.Melee,
		reports: ManeuverReport[],
		maneuver: ManeuverQuery,
	): Predicament {

	const {seconds, cancelled} = activity
	const wasCancelled = cancelled !== null && seconds >= cancelled

	if (wasCancelled) {
		const since = seconds - cancelled

		// feint predicament
		if (maneuver.phase === "windup" || maneuver.phase === "combo") {
			const phaseStart = calculate_phase_start_in_maneuver_time(
				maneuver.report.timing,
				maneuver.phase,
				maneuver.report.comboIn,
			)
			const feintDuration = maneuver.time - phaseStart
			const feintProgress = since / feintDuration
			const rewind = seconds - since
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
			const bounceDuration = maneuver.report.timing.recovery / 2
			const bounceProgress = since / bounceDuration
			const augmentedRewind = seconds - (since / 3)
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

function generateManeuverReports(maneuvers: Maneuver.Any[], weapon: Weapon.Loadout) {
	let runningTime = 0
	return maneuvers.map((maneuver, index): ManeuverReport => {
		const {timing} = weapon[maneuver.technique]
		const start = runningTime
		const comboIn = index !== 0
		const comboOut = index < (maneuvers.length - 1)
		const duration = sum_maneuver_duration(timing, comboIn, comboOut)
		runningTime += duration
		return {timing, start, duration, comboIn, comboOut}
	})
}

function queryManeuver(maneuverReports: ManeuverReport[], seconds: number) {
	let active: ManeuverQuery | null = null
	maneuverReports.forEach((report, index) => {
		const {timing, start, duration, comboIn, comboOut} = report
		const isActive = scalar.within(seconds, start, start + duration)
		if (isActive) {
			const time = seconds - start
			const phase = calculate_phase(timing, time, comboIn, comboOut)
			const progress = time / duration
			const next = maneuverReports.at(index + 1) ?? null
			active = {report, index, phase, time, progress, next}
		}
	})
	return active!
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

