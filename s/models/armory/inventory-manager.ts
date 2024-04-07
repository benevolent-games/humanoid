
import {Ecs, scalar} from "@benev/toolbox"
import {Weapon} from "./weapon.js"
import {Inventory} from "../../ecs/components/topics/warrior.js"

export class InventoryManager {
	constructor(public inventory: Ecs.ComponentState<Inventory>) {}

	get weapon(): Weapon.Details {
		const {inventory} = this
		const {equippedIndex} = inventory.belt
		return inventory.belt.slots[equippedIndex] ?? Weapon.fallback
	}

	nextWeapon() {
		this.#equipment_slot_change(1)
	}

	previousWeapon() {
		this.#equipment_slot_change(-1)
	}

	toggleShield() {
		const {inventory} = this
		inventory.shield = !inventory.shield
	}

	#equipment_slot_change(change: number) {
		const {inventory} = this
		inventory.belt.equippedIndex += change
		inventory.belt.equippedIndex = scalar.wrap(
			inventory.belt.equippedIndex,
			0,
			inventory.belt.slots.length,
		)
	}
}

