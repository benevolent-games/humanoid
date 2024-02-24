
export class Nametag {
	static parse(nametag: string) {
		return new this(nametag)
	}

	name!: string
	plain!: string
	tags: [string, boolean | string][] = []
	lod: number | null = null
	rubbish: string | null = null

	tag(key: string) {
		const found = this.tags.find(([k]) => k === key)
		return found ? found[1] : null
	}

	constructor(nametag: string) {
		for (const [, sigil, content] of nametag.matchAll(/(::|#|\.)?([^:#\.]+)/gi)) {
			switch (sigil) {

				case undefined:
					this.plain = content
					this.name = content
					break

				case "::": {
					if (content.includes("=")) {
						const [key, ...rest] = content.split("=")
						const value = (rest.length > 0) ? rest.join("=") : ""
						this.tags.push([key, value])
					}
					else
						this.tags.push([content, true])
					break
				}

				case "#":
					this.lod = parseInt(content)
					break

				case ".":
					this.rubbish = content
					this.name = this.plain + "." + content
					break
			}
		}

		if (!this.name || !this.plain)
			throw new Error(`failed to parse nametag, missing name in "${nametag}"`)
	}
}

