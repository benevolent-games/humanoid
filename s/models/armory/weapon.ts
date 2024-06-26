
import {ob} from "@benev/slate"
import {weaponDataSheet} from "./weapon-data-sheet.js"

export namespace Weapon {
	export type Name = keyof typeof weaponDataSheet
	export type Data = {
		name: Name
		grips: Grips
	}

	export const library = ob(weaponDataSheet).map(
		(grips, name) => ({grips, name})
	) satisfies Record<Name, Data>

	export const listing = Object.values(library)

	export const fallback = library.fists

	export function get(name: Name) {
		return name in library
			? library[name]
			: fallback
	}

	//////////

	export type Grip = "fists" | "onehander" | "twohander"
	export type Grips = Partial<Record<Grip, Details>>

	export type Details = {
		parry: Parry
		swing: Attack
		stab: Attack
		gripPoint: number
	}

	export type Loadout = {name: Name} & Details

	export type Parry = {
		turncap: number | null
		timing: ParryTiming
	}

	export type Attack = {
		turncap: number | null
		timing: AttackTiming
		damage: Damage
	}

	export type ParryTiming = {
		block: number
		recovery: number
		shieldRecovery: number
	}

	export type AttackTiming = {
		windup: number
		release: number
		recovery: number
		combo: number
		bounce: number
	}

	export type Damage = {
		blunt: number
		bleed: number
		pierce: number
	}
}

