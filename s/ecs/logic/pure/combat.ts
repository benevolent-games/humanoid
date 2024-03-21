
import {ob} from "@benev/slate"
import {Vec2, scalar, spline, vec2} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Attacking} from "../../../models/attacking/types.js"
import {attackReport} from "../../../models/attacking/report.js"
import {Controllable, Intent, Melee} from "../../schema/schema.js"
import {defaultParryDuration, defaultWeapon} from "../../../models/attacking/weapons.js"

const {degrees} = scalar.radians.from

const allowed = degrees(270)
const forbidden = degrees(360) - allowed
const halfForbidden = forbidden / 2

const splines = ob({
	a2: [0, 45, 90],
	a3: [45, 90, 135],
	a4: [90, 135, 180],
	a1: [0, -45, -90],
	a6: [-45, -90, -135],
	a5: [-90, -135, -180],
}).map(
	values => values
		.sort((a, b) => a - b)
		.map(scalar.radians.from.degrees)
		.map((v, index) => [v, index === 1 ? 1 : 0] as Vec2)
)

const zones = {
	left: [
		degrees(0) - halfForbidden,
		degrees(-180) + halfForbidden,
	] as Vec2,
	right: [
		degrees(0) + halfForbidden,
		degrees(180) - halfForbidden,
	] as Vec2,
}

export const combat = system("combat", [

	behavior("melee aiming")
		.select({Controllable, Intent, Melee})
		.act(() => ({intent, melee: {aim}}) => {
			if (vec2.magnitude(intent.glance) > 0)
				aim.lastGlanceNormal = vec2.normalize(intent.glance)

			const smoothed = aim.smoothedGlanceNormal = molasses2d(
				3,
				aim.smoothedGlanceNormal,
				aim.lastGlanceNormal,
			)

			const glanceAngle = Math.atan2(...smoothed)
			const zone = glanceAngle < 0
				? zones.left
				: zones.right

			aim.angle = scalar.clamp(glanceAngle, ...zone)
		}),

	behavior("set melee intent")
		.select({Controllable, Melee})
		.act(({realm}) => ({melee}) => {
			const parry = realm.tact.inputs.humanoid.buttons.parry.input
			const swing = realm.tact.inputs.humanoid.buttons.swing.input
			const stab = realm.tact.inputs.humanoid.buttons.stab.input
			melee.intent = {
				parry: parry.down && !parry.repeat,
				swing: swing.down && !swing.repeat,
				stab: stab.down && !stab.repeat,
			}
		}),

	behavior("initiate melee action")
		.select({Controllable, Melee})
		.act(() => ({melee}) => {
			if (melee.action)
				return

			if (melee.intent.parry) {
				melee.action = {
					kind: Attacking.Kind.Parry,
					seconds: 0,
					weights: null,
				}
			}
			else if (melee.intent.stab) {
				melee.action = {
					kind: Attacking.Kind.Stab,
					seconds: 0,
					angle: melee.aim.angle,
					report: null,
					weights: null,
				}
			}
			else if (melee.intent.swing) {
				melee.action = {
					kind: Attacking.Kind.Swing,
					seconds: 0,
					angle: melee.aim.angle,
					report: null,
					weights: null,
				}
			}
		}),

	behavior("sustain melee action")
		.select({Controllable, Melee})
		.act(({tick}) => ({melee}) => {
			if (melee.action)
				melee.action.seconds += tick.seconds
		}),

	behavior("generate attack report")
		.select({Controllable, Melee})
		.act(() => ({melee}) => {
			if (!melee.action)
				return

			const {kind} = melee.action
			if (kind === Attacking.Kind.Stab || kind === Attacking.Kind.Swing) {
				melee.action.report = attackReport({
					weapon: defaultWeapon,
					kind: melee.action.kind,
					seconds: melee.action.seconds,
				})
			}
		}),

	behavior("generate animation weights")
		.select({Controllable, Melee})
		.act(() => ({melee}) => {
			if (!melee.action)
				return

			const {action} = melee
			const blendtime = 0.1
			const weights: Attacking.MeleeWeights = {
				active: 0,
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

			if (action.kind === Attacking.Kind.Parry) {
				weights.active = spline.linear(action.seconds, [
					[0, 0],
					[blendtime, 1],
					[defaultParryDuration - blendtime, 1],
					[defaultParryDuration, 0],
				])
				weights.parry = weights.active
			}
			else if (action.report && (action.kind === Attacking.Kind.Stab || action.kind === Attacking.Kind.Swing)) {
				const {report} = action
				const [a, _b, c, d] = report.milestones

				weights.active = spline.linear(action.seconds, [
					[a, 0],
					[a + blendtime, 1],
					[c + blendtime, 1],
					[d + blendtime, 0],
				])

				/*
				##    -45  0  45
				##      \     /
				## -90 — ( X ) — 90
				##      /     \
				##   -135     135
				*/
				const {angle} = action
				weights.a1 = spline.linear(angle, splines.a1) * weights.active
				weights.a2 = spline.linear(angle, splines.a2) * weights.active
				weights.a3 = spline.linear(angle, splines.a3) * weights.active
				weights.a4 = spline.linear(angle, splines.a4) * weights.active
				weights.a5 = spline.linear(angle, splines.a5) * weights.active
				weights.a6 = spline.linear(angle, splines.a6) * weights.active
			}

			action.weights = weights
		}),

	behavior("end melee action")
		.select({Controllable, Melee})
		.act(() => ({melee}) => {
			if (!melee.action)
				return

			const {kind} = melee.action

			if (kind === Attacking.Kind.Parry) {
				if (melee.action.seconds > defaultParryDuration)
					melee.action = null
			}
			else if (kind === Attacking.Kind.Stab || kind === Attacking.Kind.Swing) {
				if (melee.action.report?.phase === Attacking.Phase.None)
					melee.action = null
			}
		}),
])

