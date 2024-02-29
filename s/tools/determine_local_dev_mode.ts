
export function determine_local_dev_mode(url: string) {
	const {host, search} = new URL(url)
	const params = new URLSearchParams(search)
	return (
		host.startsWith("localhost") ||
		host.startsWith("192") ||
		host.includes("cloudflare") ||
		params.has("dev")
	) && !params.has("cloud")
}

