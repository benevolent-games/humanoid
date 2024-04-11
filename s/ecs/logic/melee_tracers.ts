
import {behavior, system} from "../hub.js"
import {processHits} from "./utils/process_hits.js"
import {Melee} from "../../models/attacking/melee.js"
import {Tracers} from "../components/hybrids/tracers/tracers.js"
import {Character} from "../components/hybrids/character/character.js"
import {Inventory, MeleeAction} from "../components/topics/warrior.js"
import {InventoryManager} from "../../models/armory/inventory-manager.js"

export const melee_tracers = system("melee tracers", ({world, realm}) => [

	behavior("tracers")
		.select({Character, MeleeAction, Tracers, Inventory})
		.logic(() => entity => {
			const {physics} = realm
			const {character, meleeAction, tracers} = entity.components

			const releasePhase = Melee.is.attack(meleeAction)
				&& meleeAction.report.phase === "release"

			// start tracing
			if (releasePhase && !tracers.current) {
				const inventory = new InventoryManager(entity.components.inventory)
				const ensemble = character.weaponEnsembles.get(inventory.weaponName)!
				tracers.start(ensemble, realm.ui.debug.meleeTracers)
			}

			// continue tracing
			else if (releasePhase && tracers.current) {
				for (const {ribbon, edge} of tracers.continue()) {
					const hitRibbon = processHits({
						edge,
						ribbon,
						world,
						physics,
						meleeAction,
						entityId: entity.id,
					})
					if (hitRibbon)
						break
				}
			}

			// finish tracing
			else if (!releasePhase && tracers.current) {
				tracers.finish()
			}
		}),
])

