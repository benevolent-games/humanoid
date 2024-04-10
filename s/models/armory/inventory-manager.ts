
import {Ecs, scalar} from "@benev/toolbox"
import {Weapon} from "./weapon.js"
import {Inventory} from "../../ecs/components/topics/warrior.js"

export class InventoryManager {
	constructor(public inventory: Ecs.ComponentState<Inventory>) {}

	get weaponName(): Weapon.Name {
		return this.#weaponData.name
	}

	get weapon(): Weapon.Details {
		const {grip} = this.inventory.hands
		return this.#weaponData.grips[grip]!
	}

	get grip(): Weapon.Grip {
		return this.inventory.hands.grip
	}

	get numberOfAvailableGrips() {
		return Object.keys(this.#weaponData.grips).length
	}

	get shield() {
		return (
			this.inventory.hands.shield &&
			this.inventory.hands.grip === "onehander"
		)
	}

	nextWeapon() {
		this.#equipment_slot_change(1)
	}

	previousWeapon() {
		this.#equipment_slot_change(-1)
	}

	changeGrip() {
		const {inventory} = this
		inventory.hands.grip = this.#get_next_available_grip()
	}

	toggleShield() {
		const {inventory} = this
		inventory.hands.shield = !inventory.hands.shield
		inventory.hands.grip = "onehander"
	}

	get canToggleShield() {
		const data = this.#weaponData
		return "onehander" in data.grips
	}

	////////////////////////////////////////////////

	get #weaponData(): Weapon.Data {
		const {inventory} = this
		const {equippedBeltSlot} = inventory.hands
		return inventory.belt.slots[equippedBeltSlot] ?? Weapon.fallback
	}

	#equipment_slot_change(change: number) {
		const {inventory} = this
		inventory.hands.equippedBeltSlot += change
		inventory.hands.equippedBeltSlot = scalar.wrap(
			inventory.hands.equippedBeltSlot,
			0,
			inventory.belt.slots.length,
		)
		this.#switch_to_default_grip()
		// this.#switch_grip_if_unavailable()
	}

	#switch_to_default_grip() {
		const {inventory} = this
		const weaponData = this.#weaponData
		const defaultGrip = Object.keys(weaponData.grips)[0] as Weapon.Grip
		inventory.hands.grip = defaultGrip
	}

	// #switch_grip_if_unavailable() {
	// 	const {inventory} = this
	// 	const weaponData = this.#weaponData
	// 	const {grip} = inventory.hands

	// 	const is_available = grip in weaponData.grips
	// 	if (!is_available) {
	// 		const fallbackGrip = Object.keys(weaponData.grips)[0] as Weapon.Grip
	// 		inventory.hands.grip = fallbackGrip
	// 	}
	// }

	#get_next_available_grip() {
		const {inventory} = this
		const weaponData = this.#weaponData
		const {grip} = inventory.hands

		const availableGrips = Object.keys(weaponData.grips)
		const currentIndex = availableGrips.indexOf(grip)
		const newIndex = scalar.wrap(
			currentIndex + 1,
			0,
			availableGrips.length,
		)
		return availableGrips[newIndex] as Weapon.Grip
	}
}

