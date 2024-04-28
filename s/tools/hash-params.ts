
export class HashParams extends Map<string, string | boolean> {

	static eat_from_window() {
		const params = new this(window.location.href)
		this.#delete_from_window()
		return params
	}

	static #delete_from_window() {
		const newUrl = window.location.pathname + window.location.search
		history.pushState("", "", newUrl)
	}

	constructor(hash: string) {
		super()

		// remove leading hashtag if present
		hash = hash.startsWith("#")
			? hash.slice(1)
			: hash

		// extract key-value pairs into the map
		for (const part of hash.split("#")) {
			if (part.includes("=")) {
				const [key, value] = part.split("=")
				this.set(key, value)
			}
			else this.set(part, true)
		}
	}
}

