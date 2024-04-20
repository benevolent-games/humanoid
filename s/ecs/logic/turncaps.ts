
import {scalar, spline} from "@benev/toolbox"

import {behavior, system} from "../hub.js"
import {Intent} from "../components/plain_components.js"
import {ParryReport} from "../../models/activity/reports/parry.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {ActivityComponent, Inventory} from "../components/topics/warrior.js"
import {meleeReport} from "../../models/activity/reports/melee/melee-report.js"

export const turncaps = system("turncaps", () => [
	behavior("turncaps slow down your aim during melee")
		.select({Intent, Inventory, ActivityComponent})
		.logic(({seconds}) => ({components}) => {
			const {activityComponent: activity} = components
			const inventory = new InventoryManager(components.inventory)

			if (!activity)
				return

			const isMelee = activity.kind === "melee"
			const isParry = activity.kind === "parry"

			if (!(isMelee || isParry))
				return

			const {weapon} = inventory
			const [x, y] = components.intent.glance

			const {turncap, progress} = (() => {
				if (isParry) {
					const parry = new ParryReport(activity)
					return {
						progress: parry.progress,
						turncap: weapon.parry.turncap,
					}
				}
				else {
					const melee = meleeReport(activity)
					const {technique} = melee.logicalSnapshot.chart.maneuver
					return {
						progress: melee.logicalSnapshot.progress,
						turncap: technique === "swing"
							? weapon.swing.turncap
							: weapon.stab.turncap,
					}
				}
			})()

			if (turncap !== null) {
				const ease_in_and_out = scalar.bottom(
					spline.linear(progress, [
						[0.0, 10],
						[0.1, 1],
						[0.9, 1],
						[1.0, 10],
					])
				)
				const cap = (turncap * ease_in_and_out) * seconds
				components.intent.glance = [
					scalar.clamp(x, -cap, cap),
					scalar.clamp(y, -cap, cap),
				]
			}
		}),
])

