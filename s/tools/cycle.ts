
export class Cycle<A extends any[]> {
	#index = 0

	constructor(public readonly array: A) {
		if (array.length < 1)
			throw new Error("cycle array must not be zero")
	}

	#increment_and_wrap_index() {
		if (this.#index > (this.array.length - 1))
			this.#index = 0
		return this.#index++
	}

	grab(): A[number] {
		const index = this.#increment_and_wrap_index()
		return this.array[index]
	}
}

