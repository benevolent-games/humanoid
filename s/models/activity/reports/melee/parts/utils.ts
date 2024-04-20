
import {ManeuverPhase} from "./types.js"
import {Weapon} from "../../../../armory/weapon.js"

export function calculate_phase_start_in_maneuver_time(
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

