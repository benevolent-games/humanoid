
export function url_replace_extension(url: string, extension: string) {
	const slashed = url.split("/")
	const filename = slashed.pop()!
	const dotted = filename.split(".")
	dotted.pop()
	const name = dotted.join(".")
	return `${slashed.join("/")}/${name}${extension}`
}

