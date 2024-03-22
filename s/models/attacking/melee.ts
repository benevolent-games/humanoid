
import {ob} from "@benev/slate"
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
	}

	export type AttackReport = {
		phase: Phase
		times: Times
		progress: number
		milestones: [number, number, number, number]
	}

	export namespace Action {
		export type Base = {
			kind: Kind
			seconds: number
			weights: Weights
		}
		export type Offensive = {
			angle: number
			report: AttackReport
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
		##    -45  0  45
		##      \     /
		## -90 ————|———— 90
		##      /     \
		##   -135     135
		*/
		export const splines = (
			ob({

				// right side
				a2: [0, 45, 90],
				a3: [45, 90, 135],
				a4: [90, 135, 180],

				// left side
				a1: [0, -45, -90],
				a6: [-45, -90, -135],
				a5: [-90, -135, -180],
			})
			.map(
				values => values
					.sort((a, b) => a - b)
					.map(scalar.radians.from.degrees)
					.map((v, index) => [v, index === 1 ? 1 : 0] as Vec2)
			)
		)

		export const zones = {
			left: [
				degrees(0) - halfForbidden,
				degrees(-180) + halfForbidden,
			] as Vec2,
			right: [
				degrees(0) + halfForbidden,
				degrees(180) - halfForbidden,
			] as Vec2,
		}
	}
}

