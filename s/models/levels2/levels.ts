
import {Physics} from "@benev/toolbox"
import {Signal, signal, signals} from "@benev/slate"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Plan} from "../planning/plan.js"
import {Quality} from "../../tools/quality.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {url_add_suffix} from "../../tools/url_add_suffix.js"

export class ModelMachine {
	#quality: Signal<Quality>

	constructor(
			public loading: LoadingDock,
			quality: Quality,
		) {
		this.#quality = signals.signal(quality)
	}

	get quality() {
		return this.#quality.value
	}

	establish(glbUrl: string) {
		const op = signals.op<AssetContainer>()
		signals.reaction(() => this.quality, quality => {
			const url = url_add_suffix(glbUrl, quality)
			op.load(async() => this.loading.loadGlb({url}))
		})
		return op
	}

	async load(glbUrl: string) {
		const op = signals.op<AssetContainer>()

		const url = url_add_suffix(glbUrl, this.quality)
		await op.load(async() => this.loading.loadGlb({url}))

		signals.reaction(() => this.quality, quality => {
			const url = url_add_suffix(glbUrl, quality)
			op.load(async() => this.loading.loadGlb({url}))
		})

		return op
	}
}

export async function magic(loading: LoadingDock, rawQuality: Quality) {
	const quality = signal(rawQuality)

	const props = await signals.computedAsync(() => quality.value, quality =>
		loading.loadGlb({url: url_add_suffix("props.glb", quality)})
	)

	const level = await signals.computedAsync(() => quality.value, quality =>
		loading.loadGlb({url: url_add_suffix("level.glb", quality)})
	)

	// setup static physics
	const staticPhysics = signals.computed(() => {
		console.log("")
	})

	// prop consolidation
	const lolprops = signals.computed(() => {
	})

	// create toys
	signals.computed(() => {
		for (const mesh of level.value.meshes) {

		}
	})

	return () => {}

	// const props = machine.load("props.glb", () => {
	// 	return {
	// 		init({container, quality}) {},
	// 		dispose() {},
	// 	}
	// })
	// const level = machine.load("level.glb", () => {
	// 	return {
	// 		init({container, quality}) {},
	// 		dispose() {},
	// 	}
	// })
}

// export class Levels2<G extends Plan.Game> {
// 	props: Promise<AssetContainer>
// 	level = signals.op<LevelBox>()

// 	constructor(
// 			public gameplan: G,
// 			public physics: Physics,
// 			public loading: LoadingDock,
// 		) {
// 		this.props = loading.loadGlb(gameplan.props.viking)
// 	}

// 	async load(levelName: keyof G["levels"]) {}
// }

// export class LevelBox {
// 	container = signals.op<AssetContainer>()
// 	async changeQuality(quality: Quality) {}
// }

// /////////////////////

// export type LoadFn = (container: AssetContainer) => () => void

// export class ModelBox {
// 	#loadFns: LoadFn[] = []
// 	#disposers = new Set<() => void>()
// 	container = signals.op<AssetContainer>()

// 	constructor(
// 		public glb: Plan.Glb,
// 		public loading: LoadingDock,
// 	) {}

// 	onLoad(fn: LoadFn) {
// 		this.#loadFns.push(fn)
// 	}

// 	async load(quality: Quality) {
// 		this.dispose()

// 		const container = await this.container.load(
// 			() => this.loading.loadGlb({
// 				url: add_url_suffix(this.glb.url, quality),
// 			})
// 		)

// 		for (const loadFn of this.#loadFns)
// 			this.#disposers.add(loadFn(container))
// 	}

// 	dispose() {
// 		for (const dispose of this.#disposers)
// 			dispose()
// 		this.#disposers.clear()
// 	}
// }

// export class ModelMachine {
// 	#quality: Quality
// 	#models = new Set<ModelBox>()

// 	constructor(quality: Quality) {
// 		this.#quality = quality
// 	}

// 	get quality() {
// 		return this.#quality
// 	}

// 	addModel(model: ModelBox) {
// 		this.#models.add(model)
// 	}

// 	async changeQuality(quality: Quality) {
// 		this.#quality = quality
// 		await Promise.all([...this.#models].map(
// 			async model => await model.load(quality)
// 		))
// 	}
// }

// export class ModelManager {
// 	#models = new Map<string, {
// 		init: LoadFn
// 		disposer: (() => void) | null
// 	}>()
// }

// /////////////////////

// class Level3 {
// 	init() {
// 		return () => {}
// 	}
// 	dispose() {}
// }

// function modelize(
// 	fn: () => {
// 		init: ({}: {container: AssetContainer, quality: Quality}) => (
// 			() => void
// 		),
// 		dispose: () => void,
// 	}
// ) {}

// const coolLevel = modelize(() => {
// 	let staticPhysics: {} | null = null

// 	return {
// 		init: ({container, quality}) => {
// 			return () => {}
// 		},
// 		dispose: () => {},
// 	}
// })

// function level() {
// 	let staticPhysics: {} | null = null

// 	return (container: AssetContainer) => {
// 		staticPhysics = {}
// 		return () => {
// 			console.log(123)
// 		}
// 	}
// }

// export function loltest(loading: LoadingDock) {
// 	const machine = new ModelManager()

// }

