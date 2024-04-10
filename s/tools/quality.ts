
export type Quality = "fancy" | "mid" | "potato"

export function normalizeQualityString(quality: string): Quality {
	quality = quality.toLowerCase()
	if (quality.startsWith("fancy")) return "fancy"
	else if (quality.startsWith("mid")) return "mid"
	else return "potato"
}

