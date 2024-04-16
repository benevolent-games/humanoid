
import {scalar} from "@benev/toolbox"
import {Weapon} from "../../armory/weapon.js"
import {Activity, Maneuver} from "../exports.js"

export type ManeuverPhase = "windup" | "release" | "combo" | "recovery"

export class MeleeReport {
	readonly currentManeuver: Maneuver.Any
	readonly currentProgress: number
	readonly nextManeuver: Maneuver.Any | null
	readonly currentPhase: ManeuverPhase

	constructor(public activity: Activity.Melee) {
		const relevant = ascertain_relevant_maneuvers(activity)
		this.currentManeuver = relevant.currentManeuver
		this.currentProgress = relevant.currentProgress
		this.nextManeuver = relevant.nextManeuver
		this.currentPhase = ascertain_phase(
			activity.weapon,
			relevant.currentManeuver,
			activity.seconds,
		)
	}
}

///////////////////

function ascertain_phase(
		weapon: Weapon.Loadout,
		maneuver: Maneuver.Any,
		seconds: number,
	): ManeuverPhase {

	const {windup, release} = maneuver.technique === "swing"
		? weapon.swing.timing
		: weapon.stab.timing

	if (seconds < windup)
		return "windup"

	else if (seconds < windup + release)
		return "release"

	else {
		if (maneuver.comboable)
			return "combo"
		else
			return "recovery"
	}
}

function ascertain_relevant_maneuvers(activity: Activity.Melee) {
	const {maneuvers} = activity
	const indexOfLastManeuver = maneuvers.length - 1

	let runningTime = 0
	let currentManeuver: Maneuver.Any | null = null
	let currentProgress = 0
	let nextManeuver: Maneuver.Any | null = null

	for (let i = 0; i < maneuvers.length; i++) {
		const maneuver = maneuvers[i]
		const isCombo = i < indexOfLastManeuver

		if (activity.seconds >= runningTime) {
			currentManeuver = maneuver
			const duration = sum_up_maneuver_duration(activity.weapon, maneuver, isCombo)
			currentProgress = scalar.clamp(
				(activity.seconds - runningTime) / duration
			)
			runningTime += duration
		}
		else {
			nextManeuver = maneuver
			break
		}
	}

	if (!currentManeuver)
		throw new Error("no active maneuver found")

	return {currentManeuver, currentProgress, nextManeuver}
}

function sum_up_maneuver_duration(
		weapon: Weapon.Loadout,
		maneuver: Maneuver.Any,
		isCombo: boolean,
	) {

	const {timing} = maneuver.technique === "swing"
		? weapon.swing
		: weapon.stab

	const sum = (
		timing.windup +
		timing.release +
		(isCombo
			? timing.combo
			: timing.recovery)
	)

	return sum
}

