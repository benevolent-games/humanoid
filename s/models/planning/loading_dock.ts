
import {maptool} from "@benev/slate"
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Plan} from "./types.js"
import {Shader, make_shader} from "../assets/parts/make_shader.js"
import {GlbPostProcess} from "../glb_post_processing/parts/types.js"
import {Quality, add_quality_indicator_to_glb_url} from "../../tools/quality.js"

export type DockParams = {
	scene: Scene
	quality: Quality
	root: string
}

export class LoadingDock {
	#params: DockParams
	// #glbs = new Map<string, Promise<AssetContainer>>()
	// #shaders = new Map<string, Promise<Shader<any>>>()

	/** prepend the current root directory onto a path and return a full url */
	readonly resolve = (path: string) => `${this.#params.root}/${path}`

	/** defaults to doing nothing -- set this if you want to process all loaded glbs */
	glb_post_process: GlbPostProcess = async asset => asset

	async loadGlb(plan: Plan.Glb) {
		const {scene, quality} = this.#params
		const url = add_quality_indicator_to_glb_url(
			this.resolve(plan.path),
			quality,
		)
		const container = await load_glb(scene, url)
		// const container = await maptool(this.#glbs).guarantee(url, () =>
		// 	load_glb(scene, url)
		// 		// .then(asset => this.glb_post_process(asset, plan))
		// )
		return this.glb_post_process(container, plan)
	}

	async loadShader<Inputs extends object>(plan: Plan.Shader<Inputs>) {
		const {scene} = this.#params
		const url = this.resolve(plan.path)
		const shader = await make_shader(scene, url)
		// const shader = maptool(this.#shaders).guarantee(url, () =>
		// 	make_shader(scene, url)
		// )
		// shader.then(s => console.log(plan.path, s))
		return shader
	}

	constructor(params: DockParams) {
		this.#params = params
	}
}

