
import {weaponLibrary} from "./weapon-library.js"

export namespace Weapon {

	export type Data = {
		name: string
		grips: Grips
	}

	export const library = weaponLibrary
	export type Name = keyof typeof library
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
		parry: {timing: ParryTiming}
		swing: {timing: AttackTiming, damage: Damage}
		stab: {timing: AttackTiming, damage: Damage}
	}

	export type ParryTiming = {
		block: number
		recovery: number
	}

	export type AttackTiming = {
		windup: number
		release: number
		recovery: number
	}

	export type Damage = {
		blunt: number
		bleed: number
		pierce: number
	}
}

