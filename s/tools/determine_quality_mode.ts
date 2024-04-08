
import {Quality, normalize} from "./quality.js"

export function determine_quality_mode(url: string, fallback: Quality) {
	const {search} = new URL(url)
	const params = new URLSearchParams(search)
	const quality = params.get("quality")
	return quality
		? normalize(quality)
		: fallback
}

