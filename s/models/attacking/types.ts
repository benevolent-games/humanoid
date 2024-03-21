import { AttackReport } from "./report"

export namespace Attacking {
	export type Technique = (
		1 | 2 | 3 | 4 | 4 | 5 | 6 | 7 | 8
	)

	export type Durations = {
		windup: number
		release: number
		recovery: number
	}

	export type Weapon = {
		swing: Durations
		stab: Durations
	}

	export enum Phase {
		None,
		Windup,
		Release,
		Recovery,
	}

	export type Times = {
		windup: null | number
		release: null | number
		recovery: null | number
	}

	export enum Kind {
		Parry,
		Swing,
		Stab,
	}

	export type ParryAction = {
		kind: Kind.Parry
		seconds: number
		weights: null | MeleeWeights
	}

	export type SwingAction = {
		kind: Kind.Swing
		seconds: number
		angle: number
		report: null | AttackReport
		weights: null | MeleeWeights
	}

	export type StabAction = {
		kind: Kind.Stab
		seconds: number
		angle: number
		report: null | AttackReport
		weights: null | MeleeWeights
	}

	export type MeleeAction = ParryAction | StabAction | SwingAction

	export type MeleeWeights = {
		active: number
		parry: number
		a1: number
		a2: number
		a3: number
		a4: number
		a5: number
		a6: number
		a7: number
		a8: number
	}
}

