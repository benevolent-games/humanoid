
import {Signal, signal} from "@benev/slate"
import {Quality, normalizeQualityString} from "../../tools/quality.js"

export type QualityFn = (quality: Quality) => Promise<void>

export class QualityMachine {
	#storage: Storage
	#quality: Signal<Quality>

	constructor(storage: Storage) {
		this.#storage = storage
		this.#quality = signal(this.#load())
	}

	get quality() {
		return this.#quality.value
	}

	set quality(q: Quality) {
		const quality = normalizeQualityString(q)
		this.#storage.setItem("quality", quality)
		this.#quality.value = quality
	}

	#load() {
		return normalizeQualityString(
			this.#storage.getItem("quality") ?? "mid"
		)
	}
}

