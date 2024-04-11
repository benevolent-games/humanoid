
import {scalar, vec2} from "@benev/toolbox"

import {molasses2d} from "../../tools/molasses.js"
import {behavior, responder, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {Controllable, Intent} from "../components/plain_components.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {considerAttack, considerEquip, considerParry} from "../../models/attacking/consider.js"
import {Inventory, MeleeAction, MeleeAim, MeleeIntent, Stamina} from "../components/topics/warrior.js"

export const combat = system("combat", ({realm}) => [

	system("intentions", () => [
		behavior("set melee intent")
			.select({Controllable, MeleeIntent})
			.logic(() => ({components}) => {
				const {buttons} = realm.tact.inputs.humanoid
				components.meleeIntent = {
					parry: buttons.parry.input.down,
					swing: buttons.swing.input.down,
					stab: buttons.stab.input.down,
					nextWeapon: buttons.weapon_next.input.down,
					previousWeapon: buttons.weapon_previous.input.down,
					toggleShield: buttons.shield_toggle.input.down,
					changeGrip: buttons.weapon_grip_change.input.down,
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
				const intent = components.meleeIntent
				const inventory = new InventoryManager(components.inventory)
				const {weapon} = inventory

				if (intent.parry)
					components.meleeAction = Melee.make.parry(weapon, inventory.shield)

				else if (intent.stab)
					components.meleeAction = Melee.make.stab(weapon, angle)

				else if (intent.swing)
					components.meleeAction = Melee.make.swing(weapon, angle)

				else if (intent.nextWeapon)
					components.meleeAction = Melee.make.equip("nextWeapon")

				else if (intent.previousWeapon)
					components.meleeAction = Melee.make.equip("previousWeapon")

				else if (intent.toggleShield) {
					if (inventory.canToggleShield)
						components.meleeAction = Melee.make.equip("toggleShield")
				}

				else if (intent.changeGrip) {
					if (inventory.numberOfAvailableGrips > 1)
						components.meleeAction = Melee.make.equip("changeGrip")
				}
			}),
	]),

	behavior("sustain melee action")
		.select({MeleeAction, MeleeIntent})
		.logic(tick => ({components: {meleeIntent, meleeAction: action}}) => {
			if (action) {
				action.seconds += tick.seconds

				if (Melee.is.parry(action) && action.holdable) {
					const holding = (action.holdable && action.holdable.releasedAt === null)
					const released = !meleeIntent.parry

					if (holding && released)
						action.holdable.releasedAt = action.seconds
				}
			}
		}),

	behavior("update melee actions")
		.select({MeleeAction, Inventory})
		.logic(() => ({components}) => {
			const {meleeAction: action} = components

			if (!action)
				return

			if (Melee.is.equip(action)) {
				const inventory = new InventoryManager(components.inventory)
				const {weights, ready} = considerEquip(action.seconds)
				action.weights = weights
				if (ready && !action.done) {
					action.done = true
					switch (action.routine) {
						case "nextWeapon":
							inventory.nextWeapon()
							break
						case "previousWeapon":
							inventory.previousWeapon()
							break
						case "toggleShield":
							inventory.toggleShield()
							break
						case "changeGrip":
							inventory.changeGrip()
							break
					}
				}
			}
			else if (Melee.is.parry(action)) {
				const {weights, protective} = considerParry(action.weapon, action.holdable, action.seconds)
				action.weights = weights
				action.protective = protective
			}
			else if (Melee.is.attack(action)) {
				const {report, weights} = considerAttack(
					action.kind === "stab"
						? action.weapon.stab.timing
						: action.weapon.swing.timing,
					action.kind,
					action.seconds,
					action.earlyRecovery,
					action.angle,
				)
				action.report = report
				action.weights = weights
			}
		}),

	behavior("end melee action")
		.select({MeleeAction})
		.logic(() => ({components}) => {
			const {meleeAction: action} = components

			if (!action)
				return

			if (Melee.is.equip(action)) {
				if (action.weights.progress > 1)
					components.meleeAction = null
			}
			else if (Melee.is.parry(action)) {
				if (action.weights.progress > 1)
					components.meleeAction = null
			}
			else if (Melee.is.attack(action)) {
				if (action.report.phase === "none")
					components.meleeAction = null
			}
		}),

	responder("enable/disable reticle state")
		.select({Controllable, MeleeAim, MeleeAction})
		.respond(() => {
			realm.ui.reticle.enabled = true
			return () => { realm.ui.reticle.enabled = false }
		}),

	behavior("melee aiming")
		.select({Controllable, MeleeAim, MeleeAction})
		.logic(() => ({components: {meleeAim, meleeAction}}) => {
			realm.ui.reticle.data = {meleeAim, meleeAction}
		}),
])

