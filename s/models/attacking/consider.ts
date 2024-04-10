
import {is} from "@benev/slate"
import {scalar, spline} from "@benev/toolbox"

import {Melee} from "./melee.js"
import {Weapon} from "../armory/weapon.js"

const blendtime = 0.1
const equiptime = 0.5

export function considerEquip(seconds: number) {
	const weights = Melee.zeroWeights()

	const progress = scalar.remap(seconds, [0, equiptime])
	weights.progress = progress

	const active = spline.linear(progress, [
		[0, 0],
		[0.5, 1],
		[1, 0],
	])
	weights.equip = active
	weights.active = active
	weights.inactive = scalar.inverse(active)

	return {
		weights,
		ready: progress > 0.5,
	}
}

export function considerParry(weapon: Weapon.Details, seconds: number) {
	const {block, recovery} = weapon.parry.timing
	const a = 0
	const b = blendtime
	const c = block
	const d = block + recovery
	const active = spline.linear(seconds, [
		[a, 0],
		[b, 1],
		[c, 1],
		[d, 0],
	])
	const weights: Melee.Weights = {
		...Melee.zeroWeights(),
		active,
		parry: active,
		inactive: scalar.inverse(active),
		progress: seconds / d,
	}
	return {weights}
}

//    windup    release    recovery
// [----------|----------|----------]
// a b        c          d          e
//                x[----------]
//                earlyRecovery

export function considerAttack(
		attackDurations: Weapon.AttackTiming,
		kind: Melee.Kind,
		seconds: number,
		earlyRecovery: null | number,
		angle: number,
	) {

	const weights = Melee.zeroWeights()
	const {windup, release, recovery} = attackDurations

	const a = 0
	const b = blendtime
	const c = windup
	const d = windup + release
	const e = windup + release + recovery

	const phase = is.defined(earlyRecovery)
		? scalar.within(seconds - earlyRecovery, 0, recovery)
			? "recovery"
			: "none"
		: (
			scalar.within(seconds, a, c) ? "windup" :
			scalar.within(seconds, c, d) ? "release" :
			scalar.within(seconds, d, e) ? "recovery" :
				"none"
		)

	// bounce back on early recovery
	const bounciness = 1 / 3
	const bouncySeconds = (
		earlyRecovery === null
			? seconds
			: scalar.bottom(earlyRecovery - ((seconds - earlyRecovery) * bounciness), 0)
	)

	const progress = spline.linear(bouncySeconds, [
		[a, 0 / 3],
		[c, 1 / 3],
		[d, 2 / 3],
		[e, 3 / 3],
	])

	weights.progress = progress

	weights.active = is.defined(earlyRecovery)
		? spline.linear(seconds - earlyRecovery, [
			[0, 1],
			[recovery, 0],
		])
		: spline.linear(seconds, [
			[a, 0],
			[b, 1],
			[c, 1],
			[d, 1],
			[e, 0],
		])

	weights.inactive = scalar.inverse(weights.active)

	if (kind === "stab") {
		if (angle < 0)
			weights.a7 = weights.active
		else
			weights.a8 = weights.active
	}
	else if (kind === "swing") {
		const {splines} = Melee.Angles
		weights.a1 = spline.linear(angle, splines.a1) * weights.active
		weights.a2 = spline.linear(angle, splines.a2) * weights.active
		weights.a3 = spline.linear(angle, splines.a3) * weights.active
		weights.a4 = spline.linear(angle, splines.a4) * weights.active
		weights.a5 = spline.linear(angle, splines.a5) * weights.active
		weights.a6 = spline.linear(angle, splines.a6) * weights.active
	}

	return {
		weights,
		report: {
			phase,
			milestones: [a, b, c, d, e],
		} as Melee.AttackReport,
	}
}

