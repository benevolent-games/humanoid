
import {ob} from "@benev/slate"
import {Vec2, scalar} from "@benev/toolbox"

import {Weapon} from "../armory/weapon.js"
import {considerAttack, considerEquip, considerParry} from "./consider.js"

const {degrees} = scalar.radians.from

export namespace Melee {
	export type Kind = "equip" | "parry" | "stab" | "swing"
	export type Phase = "none" | "windup" | "release" | "recovery"

	export type Times = {
		windup: null | number
		release: null | number
		recovery: null | number
	}

	export type Weights = {
		active: number
		inactive: number
		equip: number
		parry: number
		a1: number
		a2: number
		a3: number
		a4: number
		a5: number
		a6: number
		a7: number
		a8: number
		progress: number
	}

	export function zeroWeights(): Melee.Weights {
		return {
			active: 0,
			inactive: 1,
			equip: 0,
			parry: 0,
			progress: 0,
			a1: 0, a2: 0, a3: 0, a4: 0, a5: 0, a6: 0, a7: 0, a8: 0,
		}
	}

	export type AttackReport = {
		phase: Phase
		milestones: [number, number, number, number, number]
	}

	export type EquipRoutine = "nextWeapon" | "previousWeapon" | "toggleShield" | "changeGrip"

	export namespace Action {
		export type Base = {
			kind: Kind
			seconds: number
			weights: Weights
		}
		export type Weaponized = {
			weapon: Weapon.Details
		} & Base
		export type Offensive = {
			angle: number
			report: AttackReport
			attackDurations: Weapon.AttackTiming
			earlyRecovery: null | number
		} & Weaponized

		export type Equip = {
			kind: "equip"
			routine: EquipRoutine
			done: boolean
		} & Base

		export type Parry = { kind: "parry" } & Weaponized
		export type Stab = { kind: "stab" } & Offensive
		export type Swing = { kind: "swing" } & Offensive

		export type Attack = Stab | Swing
		export type Any = Equip | Parry | Attack
	}

	export const is = {
		equip: (action: null | Action.Any): action is Action.Equip => action?.kind === "equip",
		parry: (action: null | Action.Any): action is Action.Parry => action?.kind === "parry",
		stab: (action: null | Action.Any): action is Action.Stab => action?.kind === "stab",
		swing: (action: null | Action.Any): action is Action.Swing => action?.kind === "swing",

		attack: (action: null | Action.Any): action is Action.Attack => is.swing(action) || is.stab(action),
	}

	export const make = {
		equip: (routine: EquipRoutine): Action.Equip => ({
			kind: "equip",
			routine,
			seconds: 0,
			done: false,
			weights: considerEquip(0).weights,
		}),
		parry: (weapon: Weapon.Details): Action.Parry => ({
			kind: "parry",
			weapon,
			seconds: 0,
			...considerParry(weapon, 0),
		}),
		stab: (weapon: Weapon.Details, angle: number): Action.Stab => ({
			kind: "stab",
			weapon,
			angle,
			seconds: 0,
			earlyRecovery: null,
			attackDurations: weapon.stab.timing,
			...considerAttack(weapon.stab.timing, "stab", 0, null, angle),
		}),
		swing: (weapon: Weapon.Details, angle: number): Action.Swing => ({
			kind: "swing",
			weapon,
			angle,
			seconds: 0,
			earlyRecovery: null,
			attackDurations: weapon.swing.timing,
			...considerAttack(weapon.swing.timing, "swing", 0, null, angle),
		}),
	}

	export namespace Angles {
		export const allowed = degrees(270)
		export const forbidden = degrees(360) - allowed
		export const halfForbidden = forbidden / 2

		/*
		## angles expressed as sixteenths of a circle
		##     -1  0  1
		##       \ | /
		##  -4 ————O———— 4
		##       / | \
		##     -7  8  7
		*/
		export const splines = (
			ob({

				// right side
				a2: [0, 1, 4],
				a3: [1, 4, 7],
				a4: [4, 7, 8],

				// left side
				a1: [0, -1, -4],
				a6: [-1, -4, -7],
				a5: [-4, -7, -8],
			})
			.map(
				values => values
					.sort((a, b) => a - b)

					// convert circle-sixteenths into radians
					.map(x => scalar.radians.from.turns(x / 16))

					// spline point ramping from 0, to 1, back to 0
					.map((v, index) => [v, index === 1 ? 1 : 0] as Vec2)
			)
		)

		// TODO delete obsolete code
		export const zones = {
			left: [
				-scalar.radians.from.turns(1 / 16),
				-scalar.radians.from.turns(7 / 16),
			] as Vec2,
			right: [
				scalar.radians.from.turns(1 / 16),
				scalar.radians.from.turns(7 / 16),
			] as Vec2,
		}
	}
}

