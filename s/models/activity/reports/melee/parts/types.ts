
import {Activity} from "../../../exports.js"
import {Weapon} from "../../../../armory/weapon.js"

export type MeleeReport = {
	activity: Activity.Melee
	maneuverReports: ManeuverReport[]
	activeManeuver: ManeuverQuery
	predicament: Predicament
}

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

export type NormalPredicament = {
	procedure: "normal"
	animatedManeuver: ManeuverQuery
	done: boolean
	almostDone: boolean
}

export type FeintPredicament = {
	procedure: "feint"
	animatedManeuver: ManeuverQuery
	feintTime: number
	feintDuration: number
	feintProgress: number
	done: boolean
	almostDone: boolean
}

export type BouncePredicament = {
	procedure: "bounce"
	animatedManeuver: ManeuverQuery
	bounceTime: number
	bounceDuration: number
	bounceProgress: number
	done: boolean
	almostDone: boolean
}

export type Predicament = NormalPredicament | FeintPredicament | BouncePredicament

