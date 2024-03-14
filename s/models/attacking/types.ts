
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
}

