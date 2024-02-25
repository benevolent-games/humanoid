
import {maptool} from "@benev/slate"
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Quality, add_quality_indicator_to_glb_url} from "../../tools/quality.js"
import {GlbPostProcess} from "../glb_post_processing/parts/types.js"
import { Plan } from "./types.js"
import { Shader, make_shader } from "../assets/parts/make_shader.js"

export type DockParams = {
	scene: Scene
	quality: Quality
	root: string
}

export class LoadingDock {
	#params: DockParams
	#glbs = new Map<string, Promise<AssetContainer>>()
	#shaders = new Map<string, Promise<Shader<any>>>()

	/** prepend the current root directory onto a path and return a full url */
	readonly resolve = (path: string) => `${this.#params.root}/${path}`

	/** defaults to doing nothing -- set this if you want to process all loaded glbs */
	glb_post_process: GlbPostProcess = async asset => asset

	loadGlb(plan: Plan.Glb) {
		const {scene, quality} = this.#params
		const url = add_quality_indicator_to_glb_url(
			this.resolve(plan.path),
			quality,
		)
		return maptool(this.#glbs).guarantee(url, () =>
			load_glb(scene, url)
				.then(asset => this.glb_post_process(asset, plan))
		)
	}

	loadShader<Inputs extends object>(plan: Plan.Shader<Inputs>) {
		const {scene} = this.#params
		const url = this.resolve(plan.path)
		return maptool(this.#shaders).guarantee(url, () =>
			make_shader(scene, url)
		)
	}

	constructor(params: DockParams) {
		this.#params = params
	}
}

