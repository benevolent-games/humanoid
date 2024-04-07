
import {Ecs} from "@benev/toolbox"
import {Weapon} from "./weapon.js"
import {Inventory} from "../../ecs/components/topics/warrior.js"

export class InventoryManager {
	constructor(public inventory: Ecs.ComponentState<Inventory>) {}

	get weapon(): Weapon.Details {
		const {inventory} = this
		const {equippedIndex} = inventory.belt
		return inventory.belt.slots[equippedIndex] ?? Weapon.fallback
	}
}

