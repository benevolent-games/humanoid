
import {scalar} from "@benev/toolbox"
import {Weapon} from "../../armory/weapon.js"
import {Activity, Maneuver} from "../exports.js"

export type ManeuverPhase = "windup" | "release" | "combo" | "recovery"

export type ManeuverReport = {
	index: number
	start: number
	duration: number
	seconds: number
	progress: number
	comboIn: boolean
	comboOut: boolean
	timing: Weapon.AttackTiming
	phase: ManeuverPhase
	current: Maneuver.Any
	next: Maneuver.Any | null
}

export type NormalMelee = {
	procedure: "normal"
	activity: Activity.Melee
	maneuver: ManeuverReport
	maneuverAnim: ManeuverReport
	done: boolean
	almostDone: boolean
}

export type FeintMelee = {
	procedure: "feint"
	activity: Activity.Melee
	maneuver: ManeuverReport
	maneuverAnim: ManeuverReport
	feintProgress: number
	done: boolean
	almostDone: boolean
}

export type BounceMelee = {
	procedure: "bounce"
	activity: Activity.Melee
	maneuver: ManeuverReport
	maneuverAnim: ManeuverReport
	bounceProgress: number
	done: boolean
	almostDone: boolean
}

export type MeleeReport3 = NormalMelee | FeintMelee | BounceMelee

export function meleeReport(activity: Activity.Melee): MeleeReport3 {

	// if canceled, we consider our maneuver logically "frozen in time"
	const maneuver = getManeuverStateAtTime(activity, activity.cancelled ?? activity.seconds)

	if (activity.cancelled !== null && activity.seconds >= activity.cancelled) {
		const {seconds, cancelled} = activity
		const sinceCancellation = seconds - cancelled

		// feint
		if (maneuver.phase === "windup" || maneuver.phase === "combo") {
			const feintDuration = maneuver.phase === "windup"
				? cancelled - maneuver.start
				: cancelled - (maneuver.timing.windup + maneuver.timing.release)
			console.log({feintDuration})
			const rewindBy = scalar.clamp(sinceCancellation, 0, feintDuration)
			const progress = rewindBy / feintDuration
			const feintTime = cancelled - rewindBy
			// console.log("feintTime", {rewindBy, seconds, feintTime})
			return {
				procedure: "feint",
				activity,
				maneuver,
				maneuverAnim: getManeuverStateAtTime(activity, feintTime),
				feintProgress: progress,
				done: progress >= 1,
				almostDone: progress >= 0.5,
			}
		}

		// bounce
		else if (maneuver.phase === "release") {
			const bounciness = 1 / 3
			const bounceDuration = activity.weapon[maneuver.current.technique].timing.recovery / 2
			const bounceEffectTime = scalar.bottom(sinceCancellation * bounciness, 0)
			const progress = scalar.clamp(sinceCancellation / bounceDuration)
			return {
				procedure: "bounce",
				activity,
				maneuver,
				maneuverAnim: getManeuverStateAtTime(activity, bounceEffectTime),
				bounceProgress: progress,
				done: progress >= 1,
				almostDone: progress >= 0.5,
			}
		}
	}

	// normal follow-through
	const progress = (maneuver.seconds / maneuver.duration)
	return {
		procedure: "normal",
		activity,
		maneuver,
		maneuverAnim: maneuver,
		done: progress >= 1,
		almostDone: progress >= 0.75,
	}
}

function getManeuverStateAtTime(
		{weapon, maneuvers}: Activity.Melee,
		activitySeconds: number,
	): ManeuverReport {
	let runningTime = 0
	for (let index = 0; index < maneuvers.length; index++) {
		const current = maneuvers[index]
		const {timing} = weapon[current.technique]
		const comboIn = index !== 0
		const comboOut = index < (maneuvers.length - 1)
		const start = runningTime
		const duration = sum_up_maneuver_duration(timing, comboIn, comboOut)
		const maneuverSeconds = activitySeconds - runningTime
		runningTime += duration
		return {
			index,
			start,
			duration,
			seconds: maneuverSeconds,
			progress: maneuverSeconds / duration,
			comboIn,
			comboOut,
			timing,
			phase: calculate_phase({
				seconds: activitySeconds,
				comboIn,
				comboOut,
				timing: weapon[current.technique].timing,
			}),
			current,
			next: comboOut
				? maneuvers[index + 1]
				: null,
		}
	}

	throw new Error("maneuver not found")
}

// export class MeleeMachine {
// 	constructor(public activity: Activity.Melee) {}

// 	get maneuver() {
// 		const {activity} = this
// 		return (activity.cancelled === null)
// 			? maneuverReportForTime(activity, activity.seconds)
// 			: maneuverReportForTime(activity, activity.cancelled)
// 	}

// 	get bouncySeconds() {
// 		const {activity} = this
// 		const {seconds, cancelled} = activity
// 		if (cancelled === null)
// 			return seconds
// 		else {
// 			const bounciness = 1 / 3
// 			return (
// 				cancelled === null
// 					? seconds
// 					: scalar.bottom(cancelled - ((seconds - cancelled) * bounciness), 0)
// 			)
// 		}
// 	}

// 	get animWeights() {
// 		const maneuver = maneuverReportForTime(this.activity, this.bouncySeconds)
// 		return null
// 	}
// }

// export type ManeuverReport = ReturnType<typeof maneuverReportForTime>

// function maneuverReportForTime(activity: Activity.Melee, seconds: number) {
// 	const {maneuvers, weapon} = activity
// 	const indexOfLastManeuver = maneuvers.length - 1

// 	let runningTime = 0
// 	let next: Maneuver.Any | null = null
// 	let group: null | {
// 		current: Maneuver.Any
// 		seconds: number
// 		index: number
// 		progress: number
// 		phase: ManeuverPhase
// 	} = null

// 	for (let i = 0; i < maneuvers.length; i++) {
// 		const maneuver = maneuvers[i]
// 		const isCombo = i < indexOfLastManeuver
// 		const isFirstManeuver = i === 0

// 		if (seconds >= runningTime) {
// 			const duration = sum_up_maneuver_duration(weapon, maneuver, isFirstManeuver, isCombo)
// 			const maneuverSeconds = seconds - runningTime
// 			group = {
// 				index: i,
// 				current: maneuver,
// 				seconds: maneuverSeconds,
// 				progress: scalar.clamp(maneuverSeconds / duration),
// 			}
// 			runningTime += duration
// 		}
// 		else {
// 			next = maneuver
// 			break
// 		}
// 	}

// 	if (!group)
// 		throw new Error("current maneuver not found")

// 	const isComboContinuation = group.index > 0
// 	const phase = ascertain_phase(
// 		isComboContinuation,
// 		group.current,
// 		next,
// 		group.seconds,
// 		weapon,
// 	)

// 	return {...group, next, phase}
// }

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

export class MeleeReport {
	readonly maneuver: ReturnType<typeof ascertain_maneuvering_report>
	readonly phase: ManeuverPhase
	readonly almostDone: boolean
	readonly done: boolean

	constructor(public activity: Activity.Melee) {
		this.maneuver = ascertain_maneuvering_report(activity)
		this.phase = ascertain_phase(
			this.maneuver.index > 0,
			this.maneuver.current,
			this.maneuver.next,
			this.maneuver.seconds,
			activity.weapon,
		)
		this.done = this.maneuver.progress >= 1
		this.almostDone = this.phase === "recovery"
			? this.maneuver.progress >= 0.75
			: false
	}
}

///////////////////

function ascertain_maneuvering_report(activity: Activity.Melee) {
	const {maneuvers, weapon} = activity
	const indexOfLastManeuver = maneuvers.length - 1

	let runningTime = 0
	let next: Maneuver.Any | null = null
	let group: null | {
		current: Maneuver.Any
		seconds: number
		index: number
		progress: number
	} = null

	for (let i = 0; i < maneuvers.length; i++) {
		const maneuver = maneuvers[i]
		const isCombo = i < indexOfLastManeuver
		const isFirstManeuver = i === 0

		if (activity.seconds >= runningTime) {
			// TODO BORKED
			const duration = 0
			// const duration = sum_up_maneuver_duration(weapon, maneuver, isFirstManeuver, isCombo)
			const maneuverSeconds = activity.seconds - runningTime
			group = {
				index: i,
				current: maneuver,
				seconds: maneuverSeconds,
				progress: scalar.clamp(maneuverSeconds / duration),
			}
			runningTime += duration
		}
		else {
			next = maneuver
			break
		}
	}

	if (!group)
		throw new Error("current maneuver not found")

	return {...group, next}
}

function calculate_phase({
			seconds, comboIn, comboOut, timing,
		}: {
		seconds: number
		comboIn: boolean
		comboOut: boolean
		timing: Weapon.AttackTiming
	}) {
	const isInitialAttack = !comboIn
	const {windup, release} = timing
	const outro = comboOut ? "combo" : "recovery"
	return isInitialAttack
		? (
			(seconds < windup) ? "windup" :
			(seconds < (windup + release)) ? "release" :
			outro
		)
		: (
			seconds < release ? "release" :
			outro
		)
}

function ascertain_phase(
		isComboContinuation: boolean,
		currentManeuver: Maneuver.Any,
		nextManeuver: Maneuver.Any | null,
		seconds: number,
		weapon: Weapon.Loadout,
	): ManeuverPhase {

	const {windup, release} = currentManeuver.technique === "swing"
		? weapon.swing.timing
		: weapon.stab.timing

	if (isComboContinuation) {
		if (seconds < release)
			return "release"

		else {
			if (currentManeuver.comboable && nextManeuver)
				return "combo"
			else
				return "recovery"
		}
	}
	else {
		if (seconds < windup)
			return "windup"

		else if (seconds < windup + release)
			return "release"

		else {
			if (currentManeuver.comboable && nextManeuver)
				return "combo"
			else
				return "recovery"
		}
	}
}

function sum_up_maneuver_duration(
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

