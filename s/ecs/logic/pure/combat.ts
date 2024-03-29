
import {scalar, vec2} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {molasses2d} from "../../../tools/molasses.js"
import {Melee} from "../../../models/attacking/melee.js"
import {Weapon} from "../../../models/attacking/weapon.js"
import {considerAttack, considerParry} from "../../../models/attacking/consider.js"
import {Controllable, Intent, MeleeAction, MeleeAim, MeleeIntent, MeleeWeapon} from "../../schema/schema.js"

export const combat = system("combat", [

	system("intentions", [
		behavior("set melee intent")
			.select({Controllable, MeleeIntent})
			.act(({realm}) => components => {
				const parry = realm.tact.inputs.humanoid.buttons.parry.input
				const swing = realm.tact.inputs.humanoid.buttons.swing.input
				const stab = realm.tact.inputs.humanoid.buttons.stab.input
				components.meleeIntent = {
					parry: parry.down,
					swing: swing.down,
					stab: stab.down,
				}
			}),

		behavior("melee aiming")
			.select({Intent, MeleeAim})
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

		behavior("initiate melee action")
			.select({MeleeAim, MeleeIntent, MeleeAction, MeleeWeapon})
			.act(() => components => {
				if (components.meleeAction)
					return

				const {angle} = components.meleeAim
				const weapon = Weapon.get(components.meleeWeapon)
				const {parry, stab, swing} = components.meleeIntent

				if (parry)
					components.meleeAction = Melee.make.parry(weapon)

				else if (stab)
					components.meleeAction = Melee.make.stab(weapon, angle)

				else if (swing)
					components.meleeAction = Melee.make.swing(weapon, angle)
			}),
	]),

	behavior("sustain melee action")
		.select({MeleeAction})
		.act(({tick}) => ({meleeAction}) => {
			if (meleeAction)
				meleeAction.seconds += tick.seconds
		}),

	behavior("update melee actions")
		.select({MeleeAction})
		.act(() => ({meleeAction}) => {
			if (!meleeAction)
				return

			if (Melee.is.parry(meleeAction)) {
				const {weights} = considerParry(meleeAction.weapon, meleeAction.seconds)
				meleeAction.weights = weights
			}
			else if (Melee.is.attack(meleeAction)) {
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
		.select({MeleeAction})
		.act(() => components => {
			const {meleeAction} = components

			if (!meleeAction)
				return

			if (Melee.is.parry(meleeAction)) {
				if (meleeAction.weights.progress > 1) {
					components.meleeAction = null
				}
			}
			else if (Melee.is.attack(meleeAction)) {
				if (meleeAction.report.phase === Melee.Phase.None) {
					components.meleeAction = null
				}
			}
		}),

	behavior("melee aiming")
		.select({Controllable, MeleeAim, MeleeAction})
		.act(({realm}) => ({meleeAim, meleeAction}) => {

			if (meleeAction === null)
				realm.reticuleState.aim = {busy: false, angle: meleeAim.angle}

			else if (Melee.is.parry(meleeAction))
				realm.reticuleState.aim = {busy: false, angle: null}

			else if (Melee.is.attack(meleeAction)) {
				if (Melee.is.stab(meleeAction))
					realm.reticuleState.aim = {busy: true, angle: null}

				else if (Melee.is.swing(meleeAction))
					realm.reticuleState.aim = {busy: true, angle: meleeAction.angle}
			}
		}),
])

