
import {ob} from "@benev/slate"
import {weaponDataSheet} from "./weapon-library.js"
import { Vec3 } from "@benev/toolbox"

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

	export type RibbonKind = "handle" | "damage" | "grace"
	export type ProtoRibbon = {
		kind: RibbonKind
		a: Vec3
		b: Vec3
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

