
let count = 0

export function log_sometimes(d: number, ...args: any[]) {
	count++
	if (count % d === 0)
		console.log(...args)
}

