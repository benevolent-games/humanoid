
import {Quality} from "../../../tools/quality.js"

export function add_quality_indicator_to_glb_url(url: string, quality: Quality) {
	const slashed = url.split("/")
	const filename = slashed.pop()!
	const dotted = filename.split(".")
	const extension = dotted.pop()!
	const name = dotted.join(".")
	return `${slashed.join("/")}/${name}.${quality}.${extension}`
}

