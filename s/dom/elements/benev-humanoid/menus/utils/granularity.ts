
export class Granularity {
	constructor(
		public min: number,
		public max: number,
		public step: number,
	) {}
	static ultrafine = new this(0, .1, 1 / 1_000_000)
	static fine = new this(0, 1, 1 / 1_000)
	static medium = new this(0, 10, 1 / 100)
	static coarse = new this(0, 100, 1 / 10)
	static square = new this(512, 4096, 512)
}

