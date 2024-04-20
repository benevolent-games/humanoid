
import * as MeleeFlow from "./flow.js"
import {Weapon} from "../../../../armory/weapon.js"
import {Activity, Maneuver} from "../../../exports.js"

export {MeleeFlow}

export type MeleeReport = {
	activity: Activity.Melee
	charts: ManeuverChart[]
	logicalSnapshot: MeleeSnapshot
	flow: MeleeFlow.Any
	animSnapshot: MeleeSnapshot
	done: boolean
	almostDone: boolean
}

export type ManeuverChart = {
	maneuver: Maneuver.Any
	start: number
	duration: number
	comboIn: boolean
	comboOut: boolean
	timing: Weapon.AttackTiming
}

export type ManeuverPhase = "windup" | "release" | "combo" | "recovery"

export type MeleeSnapshot = {
	index: number
	time: number
	progress: number
	phase: ManeuverPhase
	phaseTime: number
	phaseProgress: number
	chart: ManeuverChart
	next: ManeuverChart | null
}

