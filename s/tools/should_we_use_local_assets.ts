
export function should_we_use_local_assets(url: string) {
	const {host, search} = new URL(url)
	const params = new URLSearchParams(search)
	const hostname_suggests_local = (
		host.startsWith("localhost") ||
		host.startsWith("192") ||
		host.startsWith("127") ||
		host.includes("cloudflare")
	)

	if (params.has("cloud"))
		return false

	else if (params.has("local") || hostname_suggests_local)
		return true

	else
		return false
}

