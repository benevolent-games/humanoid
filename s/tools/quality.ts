
export type Quality = "fancy" | "mid" | "potato"

export function normalize(quality: string): Quality {
	quality = quality.toLowerCase()
	if (quality.startsWith("fancy")) return "fancy"
	else if (quality.startsWith("mid")) return "mid"
	else return "potato"
}

export function qualityNumber(quality: Quality) {
	switch (quality) {
		case "fancy": return 0
		case "mid": return 1
		case "potato": return 2
		default: return 2
	}
}

