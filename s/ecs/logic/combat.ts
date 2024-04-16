
import {scalar, vec2} from "@benev/toolbox"

import {molasses2d} from "../../tools/molasses.js"
import {behavior, responder, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {EquipReport} from "../../models/activity/reports/equip.js"
import {ParryReport} from "../../models/activity/reports/parry.js"
import {MeleeReport} from "../../models/activity/reports/melee.js"
import {Controllable, Intent} from "../components/plain_components.js"
import {standardEquipDuration} from "../../models/activity/standards.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {Inventory, MeleeAction, ActivityComponent, MeleeAim, MeleeIntent, ProtectiveBubble} from "../components/topics/warrior.js"

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

		behavior("initiate activity")
			.select({MeleeAim, MeleeIntent, Inventory, ActivityComponent})
			.logic(() => ({components}) => {
				if (components.activityComponent)
					return

				const {angle} = components.meleeAim
				const intent = components.meleeIntent
				const inventory = new InventoryManager(components.inventory)
				const {weapon, shield} = inventory

				if (intent.parry)
					components.activityComponent = {
						kind: "parry",
						seconds: 0,
						weapon,
						shield,
						holdable: shield
							? {released: null}
							: null,
					}

				else if (intent.swing)
					components.activityComponent = {
						kind: "melee",
						weapon,
						maneuvers: [{technique: "swing", angle, comboable: true}],
						seconds: 0,
						cancelled: null,
					}

				else if (intent.stab)
					components.activityComponent = {
						kind: "melee",
						weapon,
						maneuvers: [{technique: "stab", comboable: true}],
						seconds: 0,
						cancelled: null,
					}

				else if (intent.nextWeapon)
					components.activityComponent = {
						kind: "equip",
						routine: "nextWeapon",
						duration: standardEquipDuration,
						seconds: 0,
						switched: false,
					}

				else if (intent.previousWeapon)
					components.activityComponent = {
						kind: "equip",
						routine: "previousWeapon",
						duration: standardEquipDuration,
						seconds: 0,
						switched: false,
					}

				else if (intent.toggleShield) {
					if (inventory.canToggleShield)
						components.activityComponent = {
							kind: "equip",
							routine: "toggleShield",
							duration: standardEquipDuration,
							seconds: 0,
							switched: false,
						}
				}

				else if (intent.changeGrip) {
					if (inventory.numberOfAvailableGrips > 1)
						components.activityComponent = {
							kind: "equip",
							routine: "changeGrip",
							duration: standardEquipDuration,
							seconds: 0,
							switched: false,
						}
				}
			}),
		]),

	behavior("sustain activity")
		.select({MeleeIntent, ActivityComponent})
		.logic(tick => ({components: {meleeIntent, activityComponent: activity}}) => {
			if (activity) {
				activity.seconds += tick.seconds

				if (activity.kind === "parry" && activity.holdable) {
					const holding = (activity.holdable && activity.holdable.released === null)
					const released = !meleeIntent.parry

					if (holding && released)
						activity.holdable.released = activity.seconds
				}
			}
		}),

	behavior("actuate equip routines")
		.select({ActivityComponent, Inventory})
		.logic(() => ({components}) => {
			const {activityComponent: activity} = components
			if (activity && activity.kind === "equip") {
				const inventory = new InventoryManager(components.inventory)
				const {readyToSwitch} = new EquipReport(activity)
				if (readyToSwitch && !activity.switched) {
					activity.switched = true
					switch (activity.routine) {
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
		}),

	behavior("parry protective bubble")
		.select({ActivityComponent, ProtectiveBubble})
		.logic(() => ({components}) => {
			const {protectiveBubble, activityComponent: activity} = components
			protectiveBubble.active = false
			if (activity && activity.kind === "parry") {
				const {protective} = new ParryReport(activity)
				protectiveBubble.active = protective
			}
		}),

	behavior("melee combo maneuvers")
		.select({Inventory, ActivityComponent, MeleeIntent, MeleeAim})
		.logic(() => ({components}) => {
			const {meleeIntent, activityComponent: activity} = components
			if (activity && activity.kind === "melee") {
				const melee = new MeleeReport(activity)
				const canStartCombo = (
					melee.currentManeuver.comboable &&
					melee.nextManeuver === null &&
					melee.currentPhase === "release"
				)
				if (canStartCombo) {
					if (meleeIntent.swing)
						activity.maneuvers.push({
							technique: "swing",
							comboable: true,
							angle: components.meleeAim.angle,
						})
					if (meleeIntent.stab)
						activity.maneuvers.push({
							technique: "stab",
							comboable: true,
						})
				}
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

