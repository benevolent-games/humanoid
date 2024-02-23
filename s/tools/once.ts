
export function once<T>(fn: () => Promise<T>) {
	let promise: Promise<T> | null
	return () => (promise ?? (promise = fn()))
}

