
import {scalar} from "@benev/toolbox"
import {Activity} from "../exports.js"

export type ParryPhase = "block" | "recovery"

export class ParryReport {
	readonly phase: ParryPhase
	readonly progress: number
	readonly protective: boolean
	readonly almostDone: boolean
	readonly done: boolean

	constructor(public activity: Activity.Parry) {
		const {weapon, seconds, holdable} = activity

		const phase = (
			(seconds < weapon.parry.timing.block) ||
			(holdable && holdable.released !== null)
		) ? "block" : "recovery"

		const progress = calculate_parry_progress(activity, phase)
		this.phase = phase
		this.progress = progress
		this.protective = phase === "block"
		this.almostDone = progress >= 0.75
		this.done = progress >= 1
	}
}

/////////////////////////////////////////

function calculate_parry_progress(
		{seconds, holdable, shield, weapon}: Activity.Parry,
		phase: ParryPhase,
	) {

	const {timing} = weapon.parry
	let blockProgress = 0
	let recoveryProgress = 0
	const {block} = timing
	const recovery = shield
		? timing.shieldRecovery
		: timing.recovery

	if (phase === "block")
		blockProgress = seconds / block

	else {
		blockProgress = 1
		if (holdable)
			recoveryProgress = holdable.released !== null
				? (seconds - holdable.released) / recovery
				: 0
		else
			recoveryProgress = (seconds - block) / recovery
	}

	return scalar.clamp(
		(0.5 * blockProgress) +
		(0.5 * recoveryProgress)
	)
}

