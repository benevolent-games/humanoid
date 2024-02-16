
export class Loading {
	currently = false

	async promise<P>(p: Promise<P>) {
		this.currently = true
		const result = await p
		this.currently = false
		return result
	}

	fn<F extends (...args: any[]) => Promise<any>>(fn: F) {
		return (
			async(...args: any[]) =>
				this.promise(fn(...args))
		) as F
	}
}

