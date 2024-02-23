
export function determine_local_dev_mode() {
	return (
		window.location.host.startsWith("localhost") ||
		window.location.host.startsWith("192")
	) && !window.location.search.includes("cloud")
}

