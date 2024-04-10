
export function determine_webgpu_mode(url: string) {
	const {search} = new URL(url)
	return new URLSearchParams(search).has("webgpu")
}

