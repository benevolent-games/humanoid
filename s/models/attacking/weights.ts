
import {scalar, spline} from "@benev/toolbox"
import {Melee} from "./melee.js"
import {Weapon} from "./weapon.js"

export function generateWeights(
		{kind, seconds, angle, weapon = Weapon.fallback}: {
			kind: Melee.Kind,
			seconds: number,
			angle: number,
			weapon: Weapon.Config,
		},
	) {

	const blendtime = 0.1

	const weights: Melee.Weights = {
		active: 0,
		inactive: 0,
		parry: 0,
		a1: 0,
		a2: 0,
		a3: 0,
		a4: 0,
		a5: 0,
		a6: 0,
		a7: 0,
		a8: 0,
	}

	if (Melee.isParryKind(kind)) {
		const {block, recovery} = weapon.parry
		const a = 0
		const b = blendtime
		const c = block
		const d = block + recovery
		weights.active = spline.linear(seconds, [
			[a, 0],
			[b, 1],
			[c, 1],
			[d, 0],
		])
		weights.parry = weights.active
	}
	else if (Melee.isAttackKind(kind)) {
		const {windup, release, recovery} = kind === Melee.Kind.Swing
			? weapon.swing
			: weapon.stab
		const a = 0
		const b = blendtime
		const c = windup + release
		const d = windup + release + recovery
		weights.active = spline.linear(seconds, [
			[a, 0],
			[b, 1],
			[c, 1],
			[d, 0],
		])

		if (kind === Melee.Kind.Stab) {
			if (angle < 0)
				weights.a7 = weights.active
			else
				weights.a8 = weights.active
		}
		else if (kind === Melee.Kind.Swing) {
			const {splines} = Melee.Angles
			weights.a1 = spline.linear(angle, splines.a1) * weights.active
			weights.a2 = spline.linear(angle, splines.a2) * weights.active
			weights.a3 = spline.linear(angle, splines.a3) * weights.active
			weights.a4 = spline.linear(angle, splines.a4) * weights.active
			weights.a5 = spline.linear(angle, splines.a5) * weights.active
			weights.a6 = spline.linear(angle, splines.a6) * weights.active
		}
	}

	weights.inactive = scalar.inverse(weights.active)
	return weights
}

export function generateWeightsForParry() {}

