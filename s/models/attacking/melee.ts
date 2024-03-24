
import {ob} from "@benev/slate"
import {Weapon} from "./weapon.js"
import {Vec2, scalar} from "@benev/toolbox"

const {degrees} = scalar.radians.from

export namespace Melee {
	export enum Kind {
		Parry,
		Stab,
		Swing,
	}

	export function isParryKind(kind?: Kind) {
		return kind === Kind.Parry
	}

	export function isAttackKind(kind?: Kind) {
		return (
			kind === Kind.Stab ||
			kind === Kind.Swing
		)
	}

	export enum Phase {
		None,
		Windup,
		Release,
		Recovery,
	}

	export type Times = {
		windup: null | number
		release: null | number
		recovery: null | number
	}

	export type Weights = {
		active: number
		inactive: number
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
			parry: 0,
			progress: 0,
			a1: 0,
			a2: 0,
			a3: 0,
			a4: 0,
			a5: 0,
			a6: 0,
			a7: 0,
			a8: 0,
		}
	}

	export type AttackReport = {
		phase: Phase
		times: Times
		milestones: [number, number, number, number, number]
	}

	export namespace Action {
		export type Base = {
			kind: Kind
			seconds: number
			weights: Weights
			weapon: Weapon.Config
		}
		export type Offensive = {
			angle: number
			report: AttackReport
			attackDurations: Weapon.AttackDurations
			earlyRecovery: null | number
		} & Base

		export type Parry = { kind: Kind.Parry } & Base
		export type Stab = { kind: Kind.Stab } & Offensive
		export type Swing = { kind: Kind.Swing } & Offensive

		export type Any = Parry | Stab | Swing
		export type Attack = Stab | Swing

		export function isParry(action: null | Any) {
			return isParryKind(action?.kind)
		}

		export function isAttack(action: null | Any): action is Attack {
			return isAttackKind(action?.kind)
		}
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

