
export type Nametag = {
	name: string
	plain: string
	tags: ([string] | [string, string])[]
	lod: number | null
	rubbish: string | null
}

export function parse_nametag(nametag: string): Nametag {
	let name: string | null = null
	let plain: string | null = null
	let tags: ([string] | [string, string])[] = []
	let lod: number | null = null
	let rubbish: string | null = null

	for (const [, sigil, content] of nametag.matchAll(/(::|#|\.)?([^:#\.]+)/gi)) {
		switch (sigil) {

			case undefined:
				plain = content
				name = content
				break

			case "::": {
				if (content.includes("=")) {
					const [key, ...rest] = content.split("=")
					const value = (rest.length > 0) ? rest.join("=") : ""
					tags.push([key, value])
				}
				else
					tags.push([content])
				break
			}

			case "#":
				lod = parseInt(content)
				break

			case ".":
				rubbish = content
				name = plain + "." + content
				break
		}
	}

	if (!name || !plain)
		throw new Error(`failed to parse nametag, missing name in "${nametag}"`)

	return {name, plain, tags, lod, rubbish}
}

