
import {scalar, vec2} from "@benev/toolbox"

import {molasses2d} from "../../tools/molasses.js"
import {behavior, responder, system} from "../hub.js"
import {Activity, Angles} from "../../models/activity/exports.js"
import {EquipReport} from "../../models/activity/reports/equip.js"
import {ParryReport} from "../../models/activity/reports/parry.js"
import {Controllable, Intent} from "../components/plain_components.js"
import {standardEquipDuration} from "../../models/activity/standards.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {meleeReport} from "../../models/activity/reports/melee/melee-report.js"
import {makeActivityReport} from "../../models/activity/utils/make-activity-report.js"
import {Inventory, ActivityComponent, MeleeAim, MeleeIntent, ProtectiveBubble, NextActivity} from "../components/topics/warrior.js"

export const combat = system("combat", ({realm}) => [

	system("intentions", () => [
		behavior("set melee intent")
			.select({Controllable, MeleeIntent})
			.logic(() => ({components}) => {
				const {buttons} = realm.tact.inputs.humanoid
				components.meleeIntent = {
					swing: buttons.swing.input.down,
					stab: buttons.stab.input.down,
					parry: buttons.parry.input.down,
					feint: buttons.feint.input.down,
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
					? Angles.zones.left
					: Angles.zones.right

				meleeAim.angle = scalar.clamp(glanceAngle, ...zone)
			}),

		behavior("initiate activity")
			.select({MeleeAim, MeleeIntent, Inventory, ActivityComponent, NextActivity})
			.logic(() => ({components}) => {
				const {angle} = components.meleeAim
				const intent = components.meleeIntent
				const inventory = new InventoryManager(components.inventory)
				const {weapon, shield} = inventory

				const applyActivity = (activity: () => Activity.Any) => {
					if (components.activityComponent) {
						const report = makeActivityReport(components.activityComponent)
						if (report.almostDone)
							components.nextActivity = activity()
					}
					else {
						components.activityComponent = activity()
					}
				}

				if (intent.parry) {
					applyActivity(() => ({
						kind: "parry",
						seconds: 0,
						weapon,
						shield,
						holdable: shield
							? {released: null}
							: null,
					}))
				}

				else if (intent.swing) {
					applyActivity(() => ({
						kind: "melee",
						weapon,
						maneuvers: [{technique: "swing", comboable: true, angle}],
						seconds: 0,
						cancelled: null,
					}))
				}

				else if (intent.stab)
					applyActivity(() => ({
						kind: "melee",
						weapon,
						maneuvers: [{technique: "stab", comboable: false, angle}],
						seconds: 0,
						cancelled: null,
					}))

				else if (intent.nextWeapon)
					applyActivity(() => ({
						kind: "equip",
						routine: "nextWeapon",
						duration: standardEquipDuration,
						seconds: 0,
						switched: false,
					}))

				else if (intent.previousWeapon)
					applyActivity(() => ({
						kind: "equip",
						routine: "previousWeapon",
						duration: standardEquipDuration,
						seconds: 0,
						switched: false,
					}))

				else if (intent.toggleShield) {
					if (inventory.canToggleShield)
						applyActivity(() => ({
							kind: "equip",
							routine: "toggleShield",
							duration: standardEquipDuration,
							seconds: 0,
							switched: false,
						}))
				}

				else if (intent.changeGrip) {
					if (inventory.numberOfAvailableGrips > 1)
						applyActivity(() => ({
							kind: "equip",
							routine: "changeGrip",
							duration: standardEquipDuration,
							seconds: 0,
							switched: false,
						}))
				}
			}),
		]),

	behavior("activity seconds increase")
		.select({ActivityComponent})
		.logic(tick => ({components: {activityComponent: activity}}) => {
			if (activity)
				activity.seconds += tick.seconds
		}),

	behavior("parry holdable")
		.select({MeleeIntent, ActivityComponent})
		.logic(() => ({components: {meleeIntent, activityComponent: activity}}) => {
			if (activity && activity.kind === "parry" && activity.holdable) {
				const holding = (activity.holdable && activity.holdable.released === null)
				const released = !meleeIntent.parry
				if (holding && released)
					activity.holdable.released = activity.seconds
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
				const melee = meleeReport(activity)
				const canStartCombo = (
					melee.activeManeuver.chart.maneuver.comboable &&
					melee.activeManeuver.next === null &&
					melee.activeManeuver.phase === "release"
				)
				if (canStartCombo) {
					if (meleeIntent.swing) {
						const {angle: oldAngle} = melee.activeManeuver.chart.maneuver
						const {angle: newAngle} = components.meleeAim
						const sameSide = (oldAngle < 0) === (newAngle < 0)
						activity.maneuvers.push({
							technique: "swing",
							comboable: true,
							angle: sameSide
								? -newAngle
								: newAngle,
						})
					}
					if (meleeIntent.stab) {
						activity.maneuvers.push({
							technique: "stab",
							comboable: true,
							angle: components.meleeAim.angle,
						})
					}
				}
			}
		}),

	behavior("feints")
		.select({ActivityComponent, MeleeIntent})
		.logic(() => ({components: {meleeIntent, activityComponent: activity}}) => {
			if (meleeIntent.feint && activity && activity.kind === "melee" && activity.cancelled === null) {
				const melee = meleeReport(activity)
				const inFeintableState = melee.activeManeuver.phase === "windup" || melee.activeManeuver.phase === "combo"
				if (inFeintableState && melee.predicament.procedure === "normal")
					activity.cancelled = activity.seconds
			}
		}),

	behavior("end melee action")
		.select({ActivityComponent})
		.logic(() => ({components}) => {
			const {activityComponent: activity} = components
			if (activity && makeActivityReport(activity).done)
				components.activityComponent = null
		}),

	responder("enable/disable reticle state")
		.select({Controllable, MeleeAim})
		.respond(() => {
			realm.ui.reticle.enabled = true
			return () => { realm.ui.reticle.enabled = false }
		}),

	behavior("update reticle ui")
		.select({Controllable, MeleeAim, ActivityComponent})
		.logic(() => ({components: {meleeAim, activityComponent}}) => {
			realm.ui.reticle.data = {meleeAim, activity: activityComponent}
		}),
])

