
import {scalar} from "@benev/toolbox"
import {Weapon} from "../../armory/weapon.js"
import {Activity, Maneuver} from "../exports.js"
import {ActivityWeights} from "../../choreographer/activities/kit/weights.js"

export type ManeuverPhase = "windup" | "release" | "combo" | "recovery"

/*

Activity.Melee
	seconds,
	weapon,
	cancelled,
	maneuvers [{
		technique,
		angle,
		comboable,
	}],

MeleeReport
	activity
	phase
	weights
	maneuver
		current
			index
		next
			index

*/

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
			const duration = sum_up_maneuver_duration(weapon, maneuver, isFirstManeuver, isCombo)
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
			seconds, cancelled, comboIn, comboOut, timing
		}: {
		seconds: number
		cancelled: number
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
		weapon: Weapon.Loadout,
		maneuver: Maneuver.Any,
		isFirstManeuver: boolean,
		isCombo: boolean,
	) {

	const {timing} = maneuver.technique === "swing"
		? weapon.swing
		: weapon.stab

	const maybeWindup = isFirstManeuver
		? timing.windup
		: 0

	const sum = (
		maybeWindup +
		timing.release +
		(isCombo
			? timing.combo
			: timing.recovery)
	)

	return sum
}

