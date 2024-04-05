
export function determine_local_dev_mode(url: string) {
	const {host, search} = new URL(url)
	const params = new URLSearchParams(search)
	return (
		host.startsWith("localhost") ||
		host.startsWith("192") ||
		host.startsWith("127") ||
		host.includes("cloudflare") ||
		params.has("dev")
	) && !params.has("cloud")
}

