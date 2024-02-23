
import {Quality, quality_from_string} from "./quality.js"

export function determine_quality_mode(url: string, fallback: Quality) {
	const {search} = new URL(url)
	const params = new URLSearchParams(search)
	const q = params.get("quality")
	return q
		? quality_from_string(q)
		: fallback
}

