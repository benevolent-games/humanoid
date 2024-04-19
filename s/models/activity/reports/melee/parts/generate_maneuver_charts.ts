
import {ManeuverChart} from "./types.js"
import {Maneuver} from "../../../exports.js"
import {Weapon} from "../../../../armory/weapon.js"

export function generate_maneuver_charts(maneuvers: Maneuver.Any[], weapon: Weapon.Loadout) {
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

