
import {Attacking} from "./types.js"
import {scalar} from "@benev/toolbox"

export type AttackReport = ReturnType<typeof attackReport>

export function attackReport({seconds, kind, weapon}: {
		seconds: number
		kind: Attacking.Kind
		weapon: Attacking.Weapon
	}) {

	const {windup, release, recovery} = kind === Attacking.Kind.Swing
		? weapon.swing
		: weapon.stab

	//   windup  release  recovery
	// [''''''''|''''''''|'''''''']
	// a........b........c........d

	const a = 0
	const b = windup
	const c = windup + release
	const d = windup + release + recovery

	const phase: Attacking.Phase = (
		scalar.within(seconds, a, b) ? Attacking.Phase.Windup
		: scalar.within(seconds, b, c) ? Attacking.Phase.Release
		: scalar.within(seconds, c, d) ? Attacking.Phase.Recovery
		: Attacking.Phase.None
	)

	const times: Attacking.Times = {
		windup: phase === Attacking.Phase.Windup ? seconds - a : null,
		release: phase === Attacking.Phase.Release ? seconds - b : null,
		recovery: phase === Attacking.Phase.Recovery ? seconds - c : null,
	}

	const progress = scalar.remap(seconds, [a, d])

	return {
		phase,
		times,
		progress,
		milestones: [a, b, c, d],
	}
}

