
import {ob} from "@benev/slate"
import {Vec2, scalar, spline, vec2} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Melee} from "../../../models/attacking/melee.js"
import {Controllable, Intent, MeleeAction, MeleeAim, MeleeIntent, MeleeWeapon} from "../../schema/schema.js"
import { considerAttack, considerParry } from "../../../models/attacking/weights.js"
import { Weapon } from "../../../models/attacking/weapon.js"

// const {degrees} = scalar.radians.from

// const allowed = degrees(270)
// const forbidden = degrees(360) - allowed
// const halfForbidden = forbidden / 2

// const splines = ob({
// 	a2: [0, 45, 90],
// 	a3: [45, 90, 135],
// 	a4: [90, 135, 180],
// 	a1: [0, -45, -90],
// 	a6: [-45, -90, -135],
// 	a5: [-90, -135, -180],
// }).map(
// 	values => values
// 		.sort((a, b) => a - b)
// 		.map(scalar.radians.from.degrees)
// 		.map((v, index) => [v, index === 1 ? 1 : 0] as Vec2)
// )

// const zones = {
// 	left: [
// 		degrees(0) - halfForbidden,
// 		degrees(-180) + halfForbidden,
// 	] as Vec2,
// 	right: [
// 		degrees(0) + halfForbidden,
// 		degrees(180) - halfForbidden,
// 	] as Vec2,
// }

export const combat = system("combat", [

	behavior("melee aiming")
		.select({Controllable, Intent, MeleeAim})
		.act(() => ({intent, meleeAim}) => {
			if (vec2.magnitude(intent.glance) > 0)
				meleeAim.lastGlanceNormal = vec2.normalize(intent.glance)

			const smoothed = meleeAim.smoothedGlanceNormal = molasses2d(
				3,
				meleeAim.smoothedGlanceNormal,
				meleeAim.lastGlanceNormal,
			)

			const glanceAngle = Math.atan2(...smoothed)
			const zone = glanceAngle < 0
				? Melee.Angles.zones.left
				: Melee.Angles.zones.right

			meleeAim.angle = scalar.clamp(glanceAngle, ...zone)
		}),

	behavior("set melee intent")
		.select({Controllable, MeleeIntent})
		.act(({realm}) => components => {
			const parry = realm.tact.inputs.humanoid.buttons.parry.input
			const swing = realm.tact.inputs.humanoid.buttons.swing.input
			const stab = realm.tact.inputs.humanoid.buttons.stab.input
			components.meleeIntent = {
				parry: parry.down && !parry.repeat,
				swing: swing.down && !swing.repeat,
				stab: stab.down && !stab.repeat,
			}
		}),

	behavior("initiate melee action")
		.select({Controllable, MeleeAim, MeleeIntent, MeleeAction, MeleeWeapon})
		.act(() => components => {
			if (components.meleeAction)
				return

			const seconds = 0
			const weapon = Weapon.get(components.meleeWeapon)

			if (components.meleeIntent.parry) {
				const kind = Melee.Kind.Parry
				components.meleeAction = {
					kind,
					weapon,
					seconds,
					...considerParry(weapon, 0),
				}
			}
			else if (components.meleeIntent.stab) {
				const kind = Melee.Kind.Stab
				const angle = components.meleeAim.angle
				const {report, weights} = considerAttack(weapon, kind, seconds, angle)
				components.meleeAction = {
					kind,
					weapon,
					seconds,
					angle,
					report,
					weights,
				}
			}
			else if (components.meleeIntent.swing) {
				const kind = Melee.Kind.Swing
				const angle = components.meleeAim.angle
				const {report, weights} = considerAttack(weapon, kind, seconds, angle)
				components.meleeAction = {
					kind,
					weapon,
					seconds,
					angle,
					report,
					weights,
				}
			}
		}),

	behavior("sustain melee action")
		.select({Controllable, MeleeAction})
		.act(({tick}) => ({meleeAction}) => {
			if (meleeAction)
				meleeAction.seconds += tick.seconds
		}),

	behavior("update melee action considerations")
		.select({Controllable, MeleeAction})
		.act(({tick}) => ({meleeAction}) => {
			if (!meleeAction)
				return

			if (Melee.Action.isParry(meleeAction)) {
				const {weights} = considerParry(meleeAction.weapon, meleeAction.seconds)
				meleeAction.weights = weights
			}
			else if (Melee.Action.isAttack(meleeAction)) {
				const {report, weights} = considerAttack(
					meleeAction.weapon,
					meleeAction.kind,
					meleeAction.seconds,
					meleeAction.angle,
				)
				meleeAction.report = report
				meleeAction.weights = weights
			}
		}),

	behavior("end melee action")
		.select({Controllable, MeleeAction})
		.act(() => components => {
			const {meleeAction} = components
			if (!meleeAction)
				return

			if (meleeAction.weights.progress > 1)
				components.meleeAction = null
		}),
])

