
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

	export type RibbonKind = (
		| "handle" // weak part of weapon
		| "danger" // part that deals damage
		| "grace" // passes through environment, but still deals damage
	)

	export type Ribbon = {
		label?: string
		kind: RibbonKind
		a: Vec3
		b: Vec3
	}

	export type Shape = {
		size: Vec3
		offset: Vec3
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

