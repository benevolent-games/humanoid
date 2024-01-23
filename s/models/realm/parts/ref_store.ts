
import {id_counter} from "@benev/toolbox"

export type Ref = number

export class RefStore<Payload> {
	#map = new Map<number, Payload>()
	#new_id = id_counter()

	constructor(public name: string) {}

	keep(payload: Payload) {
		const ref = this.#new_id()
		this.#map.set(ref, payload)
		return ref
	}

	recall(ref: Ref) {
		const payload = this.#map.get(ref)
		if (!payload)
			throw new Error(`RefStore "${this.name}" failed to recall ref "${ref}"`)
		return payload
	}

	forget(ref: Ref) {
		this.#map.delete(ref)
	}
}

