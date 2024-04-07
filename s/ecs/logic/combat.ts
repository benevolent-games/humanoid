
import {Trashcan, scalar, vec2} from "@benev/toolbox"

import {molasses2d} from "../../tools/molasses.js"
import {behavior, responder, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {Controllable, Intent} from "../components/plain_components.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {considerAttack, considerParry} from "../../models/attacking/consider.js"
import {Inventory, MeleeAction, MeleeAim, MeleeIntent} from "../components/topics/warrior.js"

export const combat = system("combat", ({realm}) => [

	responder("inventory controls")
		.select({Controllable, Inventory})
		.respond(entity => {
			const trash = new Trashcan()
			const {buttons} = realm.tact.inputs.humanoid
			const inventory = new InventoryManager(entity.components.inventory)

			trash.mark(buttons.weapon_next.onPressed(() => {
				inventory.nextWeapon()
			}))

			trash.mark(buttons.weapon_previous.onPressed(() => {
				inventory.previousWeapon()
			}))

			trash.mark(buttons.shield_toggle.onPressed(() => {
				inventory.toggleShield()
			}))

			return trash.dispose
		}),

	system("intentions", () => [
		behavior("set melee intent")
			.select({Controllable, MeleeIntent})
			.logic(() => ({components}) => {
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
			.logic(() => ({components: {intent, meleeAim}}) => {
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
			.select({MeleeAim, MeleeIntent, MeleeAction, Inventory})
			.logic(() => ({components}) => {
				if (components.meleeAction)
					return

				const {angle} = components.meleeAim
				const {weapon} = new InventoryManager(components.inventory)
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
		.logic(tick => ({components: {meleeAction}}) => {
			if (meleeAction)
				meleeAction.seconds += tick.seconds
		}),

	behavior("update melee actions")
		.select({MeleeAction})
		.logic(() => ({components: {meleeAction}}) => {
			if (!meleeAction)
				return

			if (Melee.is.parry(meleeAction)) {
				const {weights} = considerParry(meleeAction.weapon, meleeAction.seconds)
				meleeAction.weights = weights
			}
			else if (Melee.is.attack(meleeAction)) {
				const {report, weights} = considerAttack(
					meleeAction.kind === Melee.Kind.Stab
						? meleeAction.weapon.timings.stab
						: meleeAction.weapon.timings.swing,
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
		.logic(() => ({components}) => {
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

	responder("enable/disable reticule state")
		.select({Controllable, MeleeAim, MeleeAction})
		.respond(() => {
			realm.reticuleState.enabled = true
			return () => { realm.reticuleState.enabled = false }
		}),

	behavior("melee aiming")
		.select({Controllable, MeleeAim, MeleeAction})
		.logic(() => ({components: {meleeAim, meleeAction}}) => {

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

