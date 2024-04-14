
import {Weapon} from "../../armory/weapon.js"
import {Activity, Maneuver} from "../exports.js"

export class MeleeReport {
	readonly currentManeuver: Maneuver.Any
	readonly currentProgress: number
	readonly nextManeuver: Maneuver.Any | null
	readonly currentPhase: "recovery" | "windup" | "combo" | "recovery"

	constructor(public activity: Activity.Melee) {
		const relevant = ascertain_relevant_maneuvers(activity)
		this.currentManeuver = relevant.currentManeuver
		this.currentProgress = relevant.currentProgress
		this.nextManeuver = relevant.nextManeuver
		this.currentPhase = ascertain_phase(activity.weapon, relevant.currentManeuver)
	}
}

///////////////////

function ascertain_phase(weapon: Weapon.Loadout, maneuver: Maneuver.Any) {
	const {windup, release, recovery} = maneuver.technique === "swing"
		? weapon.swing.timing
		: weapon.stab.timing
}

function ascertain_relevant_maneuvers(activity: Activity.Melee) {
	let runningTime = 0
	let currentManeuver: Maneuver.Any | null = null
	let currentProgress = 0
	let nextManeuver: Maneuver.Any | null = null

	for (const maneuver of activity.maneuvers) {
		if (activity.seconds >= runningTime) {
			currentManeuver = maneuver
			const duration = sum_up_maneuver_duration(activity.weapon, maneuver)
			currentProgress = (activity.seconds - runningTime) / duration
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

function sum_up_maneuver_duration(weapon: Weapon.Loadout, maneuver: Maneuver.Any) {
	const {timing} = maneuver.technique === "swing"
		? weapon.swing
		: weapon.stab

	const sum = (
		timing.windup +
		timing.release +
		timing.recovery
	)

	return sum
}

