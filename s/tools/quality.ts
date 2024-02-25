
export enum Quality {
	Fancy = 0,
	Mid = 1,
	Potato = 2,
}

export type QualityString = "fancy" | "mid" | "potato"

export function quality_to_string(q: Quality): QualityString {
	return (
		q === Quality.Fancy ? "fancy" :
		q === Quality.Mid ? "mid" :
		"potato"
	)
}

export function quality_from_string(q: string) {
	return (
		q === "fancy" ? Quality.Fancy :
		q === "mid" ? Quality.Mid :
		Quality.Potato
	)
}

export function add_quality_indicator_to_glb_url(url: string, quality: Quality) {
	const slashed = url.split("/")
	const filename = slashed.pop()!
	const dotted = filename.split(".")
	const extension = dotted.pop()!
	const name = dotted.join(".")
	return `${slashed.join("/")}/${name}.${quality}.${extension}`
}

