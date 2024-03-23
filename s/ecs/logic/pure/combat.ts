
import {scalar, vec2} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Melee} from "../../../models/attacking/melee.js"
import {Weapon} from "../../../models/attacking/weapon.js"
import {considerAttack, considerParry} from "../../../models/attacking/consider.js"
import {Controllable, Intent, MeleeAction, MeleeAim, MeleeIntent, MeleeWeapon} from "../../schema/schema.js"

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
				const {weights} = considerParry(weapon, seconds)
				components.meleeAction = {
					kind,
					weapon,
					seconds,
					weights,
				}
			}
			else if (components.meleeIntent.stab) {
				const kind = Melee.Kind.Stab
				const angle = components.meleeAim.angle
				const earlyRecovery = null
				const attackDurations = weapon.stab
				const {report, weights} = considerAttack(attackDurations, kind, seconds, earlyRecovery, angle)
				components.meleeAction = {
					kind,
					weapon,
					seconds,
					angle,
					report,
					weights,
					earlyRecovery,
					attackDurations,
				}
			}
			else if (components.meleeIntent.swing) {
				const kind = Melee.Kind.Swing
				const angle = components.meleeAim.angle
				const earlyRecovery = null
				const attackDurations = weapon.swing
				const {report, weights} = considerAttack(attackDurations, kind, seconds, earlyRecovery, angle)
				components.meleeAction = {
					kind,
					weapon,
					seconds,
					angle,
					report,
					weights,
					earlyRecovery,
					attackDurations,
				}
			}
		}),

	behavior("sustain melee action")
		.select({Controllable, MeleeAction})
		.act(({tick}) => ({meleeAction}) => {
			if (meleeAction)
				meleeAction.seconds += tick.seconds
		}),

	behavior("update melee actions")
		.select({Controllable, MeleeAction})
		.act(() => ({meleeAction}) => {
			if (!meleeAction)
				return

			if (Melee.Action.isParry(meleeAction)) {
				const {weights} = considerParry(meleeAction.weapon, meleeAction.seconds)
				meleeAction.weights = weights
			}
			else if (Melee.Action.isAttack(meleeAction)) {
				const {report, weights} = considerAttack(
					meleeAction.kind === Melee.Kind.Stab
						? meleeAction.weapon.stab
						: meleeAction.weapon.swing,
					meleeAction.kind,
					meleeAction.seconds,
					meleeAction.earlyRecovery,
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

			if (Melee.Action.isParry(meleeAction)) {
				if (meleeAction.weights.progress > 1) {
					components.meleeAction = null
				}
			}
			else if (Melee.Action.isAttack(meleeAction)) {
				if (meleeAction.report.phase === Melee.Phase.None) {
					components.meleeAction = null
				}
			}
		}),
])

