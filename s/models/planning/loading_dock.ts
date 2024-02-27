
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"

import {Plan} from "./plan.js"
import {make_shader} from "../assets/parts/make_shader.js"
import {GlbPostProcess} from "../glb_post_processing/parts/types.js"

export class LoadingDock {
	constructor(private readonly scene: Scene) {}

	/** defaults to doing nothing -- set this if you want to process all loaded glbs */
	glb_post_process: GlbPostProcess = async asset => asset

	async loadGlb(plan: Plan.Glb) {
		return this.glb_post_process(
			await load_glb(this.scene, plan.url),
			plan,
		)
	}

	async loadShader<Inputs extends object>(plan: Plan.Shader<Inputs>) {
		return make_shader(this.scene, plan)
	}
}

