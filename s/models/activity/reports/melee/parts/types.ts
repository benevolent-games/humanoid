
import {Activity, Maneuver} from "../../../exports.js"
import {Weapon} from "../../../../armory/weapon.js"

export type MeleeReport = {
	activity: Activity.Melee
	maneuverReports: ManeuverReport[]
	activeManeuver: ManeuverQuery
	predicament: Predicament
} & BasePredicament

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
	maneuver: Maneuver.Any
	start: number
	duration: number
	comboIn: boolean
	comboOut: boolean
	timing: Weapon.AttackTiming
}

type BasePredicament = {
	animatedManeuver: ManeuverQuery
	done: boolean
	almostDone: boolean
}

export type NormalPredicament = {
	procedure: "normal"
} & BasePredicament

export type FeintPredicament = {
	procedure: "feint"
	feintTime: number
	feintDuration: number
	feintProgress: number
} & BasePredicament

export type BouncePredicament = {
	procedure: "bounce"
	bounceTime: number
	bounceDuration: number
	bounceProgress: number
} & BasePredicament

export type Predicament = NormalPredicament | FeintPredicament | BouncePredicament

