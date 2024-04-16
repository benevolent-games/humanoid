
import {scalar, spline} from "@benev/toolbox"
import {zeroWeights} from "../kit/zero-weights.js"
import {Angles} from "../../../activity/exports.js"
import {MeleeReport} from "../../../activity/reports/melee.js"

export function equipMelee({activity}: MeleeReport) {
	const weights = zeroWeights()

	const {cancelled} = activity
	const {phase, maneuver} = new MeleeReport(activity)
	const {seconds} = maneuver
	const {windup, release, combo, recovery} = maneuver.current.technique === "swing"
		? activity.weapon.swing.timing
		: activity.weapon.stab.timing

	const a = 0
	const b = windup / 3
	const c = windup
	const d = windup + release
	const e = windup + release + (phase === "combo" ? combo : recovery)

	// bounce back on early recovery
	const bounciness = 1 / 3
	const bouncySeconds = (
		cancelled === null
			? seconds
			: scalar.bottom(cancelled - ((seconds - cancelled) * bounciness), 0)
	)

	const progress = spline.linear(bouncySeconds, [
		[a, 0 / 3],
		[c, 1 / 3],
		[d, 2 / 3],
		[e, 3 / 3],
	])

	weights.progress = progress

	weights.active = cancelled !== null
		? spline.linear(seconds - cancelled, [
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

	if (maneuver.current.technique === "stab") {
		if (maneuver.current.angle < 0)
			weights.a7 = weights.active
		else
			weights.a8 = weights.active
	}
	else if (maneuver.current.technique === "swing") {
		const {angle} = maneuver.current
		const {splines} = Angles
		weights.a1 = spline.linear(angle, splines.a1) * weights.active
		weights.a2 = spline.linear(angle, splines.a2) * weights.active
		weights.a3 = spline.linear(angle, splines.a3) * weights.active
		weights.a4 = spline.linear(angle, splines.a4) * weights.active
		weights.a5 = spline.linear(angle, splines.a5) * weights.active
		weights.a6 = spline.linear(angle, splines.a6) * weights.active
	}

	return weights
}

