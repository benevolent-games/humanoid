
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

		const blockphase_because_of_timing = (seconds < weapon.parry.timing.block)
		const blockphase_because_of_being_held = (holdable && holdable.released === null)

		const phase = (
			blockphase_because_of_timing ||
			blockphase_because_of_being_held
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
	const {block} = timing
	const recovery = shield
		? timing.shieldRecovery
		: timing.recovery

	let blockProgress = 0
	let recoveryProgress = 0

	if (phase === "block")
		blockProgress = scalar.clamp(seconds / block)

	else {
		blockProgress = 1
		if (holdable) {
			const {released} = holdable
			if (released !== null) {
				const recoveryBegins = scalar.bottom(released, block)
				const recoveryTime = seconds - recoveryBegins
				recoveryProgress = recoveryTime / recovery
			}
		}
		else {
			recoveryProgress = (seconds - block) / recovery
		}
	}

	const totalProgress = scalar.clamp(
		(0.5 * blockProgress) +
		(0.5 * recoveryProgress)
	)

	return totalProgress
}

