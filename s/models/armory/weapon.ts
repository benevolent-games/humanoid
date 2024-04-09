
import {Vec3} from "@benev/toolbox"
import {weaponLibrary} from "./weapon-library.js"

export namespace Weapon {
	export type ParryTimings = {
		block: number
		recovery: number
	}

	export type AttackTimings = {
		windup: number
		release: number
		recovery: number
	}

	export type Timings = {
		parry: ParryTimings
		swing: AttackTimings
		stab: AttackTimings
	}

	export type Damage = {
		blunt: number
		bleed: number
		pierce: number
	}

	export type Damages = {
		swing: Damage
		stab: Damage
	}

	/** dimensions of the weapon's bounding box */
	export type Box = Vec3

	/** scaled to the weapon box, so 0 is one side, 1 is the other side, 0.5 is the middle */
	export type Space = Vec3

	export type RibbonKind = (
		| "handle" // weak part of weapon
		| "danger" // part that deals damage
		| "grace" // passes through environment, but still deals damage
	)

	export type Ribbon = {
		label?: string
		kind: RibbonKind
		a: Space
		b: Space
	}

	export type Shape = {
		size: Box
		swingRibbons: Ribbon[]
		stabRibbons: Ribbon[]
	}

	export type Grip = "fists" | "onehander" | "twohander"

	export type Config = {
		grip: Grip
		shape: Shape
		timings: Timings
		damages: Damages
	}

	export type Details = {name: Name} & Config

	export const library = weaponLibrary
	export const listing = Object.values(weaponLibrary)
	export const fallback: Details = library.fists
	export type Name = keyof typeof library

	export function get(name: Name) {
		if (!(name in library))
			throw new Error(`weapon not found "${name}"`)
		return library[name]
	}
}

