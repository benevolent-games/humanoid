
import {ob} from "@benev/slate"
import {Meshoid, Vec3} from "@benev/toolbox"
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

	export type RibbonKind = "handle" | "damage" | "grace"

	export type ProtoRibbon = {
		kind: RibbonKind
		a: Vec3
		b: Vec3
	}

	export type Meta = {
		nearcap: Vec3
		protoRibbons: ProtoRibbon[]
	}

	export type Metas = Map<Name, () => Meta>

	//////////

	export type Grip = "fists" | "onehander" | "twohander"
	export type Grips = Partial<Record<Grip, Details>>

	export type Details = {
		parry: Parry
		swing: Attack
		stab: Attack
	}

	export type Parry = {
		timing: ParryTiming
	}

	export type Attack = {
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
	}

	export type Damage = {
		blunt: number
		bleed: number
		pierce: number
	}
}

