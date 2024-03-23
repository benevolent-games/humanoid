
import {Pojo} from "@benev/slate"

export namespace Weapon {
	export type ParryDurations = {
		block: number
		recovery: number
	}

	export type AttackDurations = {
		windup: number
		release: number
		recovery: number
	}

	export type Config = {
		parry: ParryDurations
		swing: AttackDurations
		stab: AttackDurations
	}

	export const library = {
		fists: {
			parry: {block: .5, recovery: .5},
			swing: {windup: .3, release: .3, recovery: .3},
			stab: {windup: .3, release: .3, recovery: .3},
		},
		longsword: {
			parry: {block: .5, recovery: .5},
			swing: {windup: .5, release: .5, recovery: .5},
			stab: {windup: .5, release: .5, recovery: .5},
		},
	} satisfies Pojo<Config>

	export const fallback = library.longsword
	export type Name = keyof typeof library

	export function get(name: Name) {
		if (!(name in library))
			throw new Error(`weapon not found "${name}"`)
		return library[name]
	}
}

