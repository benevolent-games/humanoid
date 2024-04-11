
import {scalar, spline} from "@benev/toolbox"
import {behavior, system} from "../hub.js"
import {Melee} from "../../models/attacking/melee.js"
import {Intent} from "../components/plain_components.js"
import {Inventory, MeleeAction} from "../components/topics/warrior.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"

export const turncaps = system("turncaps", () => [
	behavior("turncaps slow down your aim during melee")
		.select({Intent, MeleeAction, Inventory})
		.logic(({seconds}) => ({components}) => {
			const {meleeAction: action} = components
			const inventory = new InventoryManager(components.inventory)

			if (Melee.is.attack(action) || Melee.is.parry(action)) {
				const {weapon} = inventory
				const [x, y] = components.intent.glance

				const turncap = (
					Melee.is.parry(action) ? weapon.parry.turncap
					: Melee.is.swing(action) ? weapon.swing.turncap
					: weapon.stab.turncap
				)

				if (turncap !== null) {
					const ease_in_and_out = scalar.bottom(
						spline.linear(action.weights.progress, [
							[0.0, 10],
							[0.1, 1],
							[0.9, 1],
							[1.0, 10],
						])
					)
					// console.log(ease_in_and_out.toFixed(2))
					const cap = (turncap * ease_in_and_out) * seconds
					components.intent.glance = [
						scalar.clamp(x, -cap, cap),
						scalar.clamp(y, -cap, cap),
					]
				}
			}
		}),
])

