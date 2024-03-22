
// import {scalar} from "@benev/toolbox"
// import {Melee} from "./melee.js"
// import {Weapon} from "./weapon.js"

// export function attackReport(
// 		kind: Melee.Kind,
// 		weapon: Weapon.Config,
// 		seconds: number,
// 	): Melee.AttackReport {

// 	const {windup, release, recovery} = kind === Melee.Kind.Swing
// 		? weapon.swing
// 		: weapon.stab

// 	//   windup  release  recovery
// 	// [''''''''|''''''''|'''''''']
// 	// a........b........c........d

// 	const a = 0
// 	const b = windup
// 	const c = windup + release
// 	const d = windup + release + recovery

// 	const phase: Melee.Phase = (
// 		scalar.within(seconds, a, b) ? Melee.Phase.Windup
// 		: scalar.within(seconds, b, c) ? Melee.Phase.Release
// 		: scalar.within(seconds, c, d) ? Melee.Phase.Recovery
// 		: Melee.Phase.None
// 	)

// 	const times: Melee.Times = {
// 		windup: phase === Melee.Phase.Windup ? seconds - a : null,
// 		release: phase === Melee.Phase.Release ? seconds - b : null,
// 		recovery: phase === Melee.Phase.Recovery ? seconds - c : null,
// 	}

// 	const progress = scalar.remap(seconds, [a, d])

// 	return {
// 		phase,
// 		times,
// 		progress,
// 		milestones: [a, b, c, d],
// 	}
// }

