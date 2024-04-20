
import {behavior, system} from "../hub.js"
import {processHits} from "./utils/process_hits.js"
import {Tracers} from "../components/hybrids/tracers.js"
import {Character} from "../components/hybrids/character/character.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"
import {ActivityComponent, Inventory} from "../components/topics/warrior.js"
import {meleeReport} from "../../models/activity/reports/melee/melee-report.js"

export const melee_tracers = system("melee tracers", ({world, realm}) => [

	behavior("tracers")
		.select({Character, ActivityComponent, Tracers, Inventory})
		.logic(() => entity => {
			const {physics} = realm
			const {character, activityComponent, tracers} = entity.components

			if (activityComponent?.kind !== "melee")
				return

			const melee = meleeReport(activityComponent)
			const active = (
				melee.logicalSnapshot.phase === "release" &&
				melee.activity.cancelled === null
			)

			// start tracing
			if (active && !tracers.current) {
				const inventory = new InventoryManager(entity.components.inventory)
				const ensemble = character.weaponEnsembles.get(inventory.weaponName)!
				tracers.start(ensemble, realm.ui.debug.meleeTracers)
			}

			// continue tracing
			else if (active && tracers.current) {
				for (const {ribbon, edge} of tracers.continue()) {
					const hitRibbon = processHits({
						edge,
						ribbon,
						world,
						physics,
						meleeReport: melee,
						entityId: entity.id,
					})
					if (hitRibbon)
						break
				}
			}

			// finish tracing
			else if (!active && tracers.current) {
				tracers.finish()
			}
		}),

])

