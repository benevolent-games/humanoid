
import {Attacking} from "./types.js"
import {scalar} from "@benev/toolbox"

export function attackReport(o: {
		seconds: number
		weapon: Attacking.Weapon
		technique: Attacking.Technique
	}) {

	const {windup, release, recovery} = o.technique < 7
		? o.weapon.swing
		: o.weapon.stab

	//   windup  release  recovery
	// [''''''''|''''''''|'''''''']
	// a........b........c........d

	const a = 0
	const b = windup
	const c = windup + release
	const d = windup + release + recovery

	const phase: Attacking.Phase = (
		scalar.within(o.seconds, a, b) ? Attacking.Phase.Windup
		: scalar.within(o.seconds, b, c) ? Attacking.Phase.Release
		: scalar.within(o.seconds, c, d) ? Attacking.Phase.Recovery
		: Attacking.Phase.None
	)

	const times: Attacking.Times = {
		windup: phase === Attacking.Phase.Windup ? o.seconds - a : null,
		release: phase === Attacking.Phase.Release ? o.seconds - b : null,
		recovery: phase === Attacking.Phase.Recovery ? o.seconds - c : null,
	}

	return {
		phase,
		times,
		milestones: [a, b, c, d],
	}
}

