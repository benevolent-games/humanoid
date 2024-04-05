
export function ratelimit(hertz: number, fn: (delta: number) => void) {
	const step = 1000 / hertz
	let accumulator = 0

	return (ms: number) => {
		accumulator += ms

		while (accumulator >= step) {
			fn(step)
			accumulator -= step
		}
	}
}

