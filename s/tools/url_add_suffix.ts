
export function url_add_suffix(url: string, suffix: string) {
	const parts = url.split(".")
	const extension = parts.pop()!
	return [...parts, suffix, extension].join(".")
}

