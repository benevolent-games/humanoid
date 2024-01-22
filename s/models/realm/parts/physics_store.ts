
import {Phys, id_counter} from "@benev/toolbox"

export class PhysicsStore {
	#map = new Map<number, Phys.Actor>
	#new_reference = id_counter()

	keep(actor: Phys.Actor) {
		const ref = this.#new_reference()
		this.#map.set(ref, actor)
		return ref
	}

	recall(ref: number) {
		const actor = this.#map.get(ref)
		if (!actor)
			throw new Error(`PhysicsStore failed to recall actor ${ref}`)
		return actor
	}

	forget(ref: number) {
		this.#map.delete(ref)
	}
}

