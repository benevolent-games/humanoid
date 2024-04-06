
import {Pojo} from "@benev/slate"
import {Vec3} from "@benev/toolbox"

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

	export type Timings = {
		parry: ParryDurations
		swing: AttackDurations
		stab: AttackDurations
	}

	export type Damage = {
		blunt: number
		bleed: number
		pierce: number
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

	export type Config = {
		shape: Shape
		timings: Timings
		damages: {
			swing: Damage
			stab: Damage
		}
	}

	export const library = {

		fists: {
			timings: {
				parry: {block: .5, recovery: .5},
				swing: {windup: .4, release: .4, recovery: .4},
				stab: {windup: .3, release: .3, recovery: .3},
			},
			damages: {
				swing: {blunt: 10, bleed: 0, pierce: 0},
				stab: {blunt: 10, bleed: 0, pierce: 0},
			},
			shape: {
				size: [0, 0.15, 0],
				swingRibbons: [
					{
						kind: "danger",
						a: [0, 0, 0],
						b: [0, 1, 0],
					},
				],
				stabRibbons: [
					{
						kind: "danger",
						a: [0, 0, 0],
						b: [0, 1, 0],
					},
				],
			},
		},

		longsword: {
			timings: {
				parry: {block: .5, recovery: .5},
				swing: {windup: .5, release: .5, recovery: .5},
				stab: {windup: .5, release: .5, recovery: .5},
			},
			damages: {
				swing: {blunt: 20, bleed: 50, pierce: 0},
				stab: {blunt: 20, bleed: 30, pierce: 40},
			},
			shape: {
				size: [0.1, 1.2, 0.1],
				swingRibbons: [
					{kind: "handle", a: [0, -4 / 8, 0], b: [0, 1 / 8, 0]},
					{kind: "danger", a: [0, 1 / 8, 0], b: [0, 7 / 8, 0]},
					{kind: "grace", a: [0, 7 / 8, 0], b: [0, 8 / 8, 0]},
				],
				stabRibbons: [
					{kind: "handle", a: [0, -4 / 8, 0], b: [0, 1 / 8, 0]},
					{kind: "danger", a: [0, 1 / 8, 0], b: [0, 8 / 8, 0]},
				],
			},
		},

		hatchet: {
			timings: {
				parry: {block: .5, recovery: .5},
				swing: {windup: .4, release: .4, recovery: .4},
				stab: {windup: .4, release: .4, recovery: .4},
			},
			damages: {
				swing: {blunt: 40, bleed: 20, pierce: 30},
				stab: {blunt: 10, bleed: 0, pierce: 0},
			},
			shape: {
				size: [0.1, 0.8, 0.1],
				swingRibbons: [
					{kind: "handle", a: [0, 0 / 8, 0], b: [0, 7 / 8, 0]},
					{kind: "danger", a: [0, 7 / 8, 0], b: [0, 8 / 8, 0]},
				],
				stabRibbons: [
					{kind: "handle", a: [0, 0 / 8, 0], b: [0, 7 / 8, 0]},
					{kind: "danger", a: [0, 7 / 8, 0], b: [0, 8 / 8, 0]},
				],
			},
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

