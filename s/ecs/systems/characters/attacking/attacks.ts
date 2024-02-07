
import {scalar} from "@benev/toolbox"

//   windup  release  recovery
// [''''''''|''''''''|'''''''']
// a........b........c........d

const windup = 1
const release = 1
const recovery = 1

const a = 0
const b = windup
const c = windup + release
const d = windup + release + recovery

export enum AttackPhase {
	None,
	Windup,
	Release,
	Recovery,
}

export type AttackTimes = {
	windup: null | number
	release: null | number
	recovery: null | number
}

export function phase_report(seconds: number) {
	const phase: AttackPhase = (
		scalar.within(seconds, a, b) ? AttackPhase.Windup
		: scalar.within(seconds, b, c) ? AttackPhase.Release
		: scalar.within(seconds, c, d) ? AttackPhase.Recovery
		: AttackPhase.None
	)

	const times: AttackTimes = {
		windup: phase === AttackPhase.Windup ? seconds - a : null,
		release: phase === AttackPhase.Release ? seconds - b : null,
		recovery: phase === AttackPhase.Recovery ? seconds - c : null,
	}

	return {phase, times}
}

