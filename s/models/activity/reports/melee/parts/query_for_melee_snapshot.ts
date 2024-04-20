
import {Weapon} from "../../../../armory/weapon.js"
import {ManeuverChart, MeleeSnapshot} from "./types.js"
import {calculate_phase_start_in_maneuver_time} from "./utils.js"

export function query_for_melee_snapshot(charts: ManeuverChart[], seconds: number): MeleeSnapshot {
	let active: MeleeSnapshot | null = null
	seconds = Math.max(seconds, 0)

	charts.forEach((chart, index) => {
		const {timing, start, duration, comboIn, comboOut} = chart
		if (seconds >= start) {
			const time = seconds - start
			const phase = calculate_phase(timing, time, comboIn, comboOut)
			const phaseStart = calculate_phase_start_in_maneuver_time(timing, phase, comboIn)
			const phaseTime = time - phaseStart
			const phaseProgress = phaseTime / timing[phase]
			const progress = time / duration
			const next = charts.at(index + 1) ?? null
			active = {
				chart,
				index,
				phase,
				phaseTime,
				phaseProgress,
				time,
				progress,
				next,
			}
		}
	})

	if (!active)
		throw new Error("no active maneuver")

	return active
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

