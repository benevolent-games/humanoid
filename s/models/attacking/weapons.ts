
import {Pojo} from "@benev/slate"
import {Attacking} from "./types.js"

export const weapons = {
	fists: {
		swing: {windup: .3, release: .3, recovery: .3},
		stab: {windup: .3, release: .3, recovery: .3},
	},
	longsword: {
		swing: {windup: .5, release: .3, recovery: .5},
		stab: {windup: .5, release: .5, recovery: .5},
	},
} satisfies Pojo<Attacking.Weapon>

export const defaultWeapon = weapons.longsword

export const defaultParryDuration = 0.5

