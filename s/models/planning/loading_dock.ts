
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"

import {Plan} from "./plan.js"
import {Shader} from "../glb/parts/shader.js"
import {CommitHash} from "../../tools/commit_hash.js"
import {GlbPostProcess, ShaderPostProcess} from "../glb/parts/types.js"

export class LoadingDock {
	constructor(
		private readonly scene: Scene,
		private readonly commit: CommitHash,
	) {}

	glb_post_process: GlbPostProcess = async() => {}
	shader_post_process: ShaderPostProcess = async() => {}

	async loadGlb(plan: Plan.Glb) {
		const glb = await load_glb(this.scene, this.commit.augment(plan.url))
		await this.glb_post_process(glb, plan)
		return glb
	}

	async loadShader<Inputs extends object>(plan: Plan.Shader<Inputs>, name: string) {
		const shader = await Shader.make(this.scene, this.commit, plan, name)
		await this.shader_post_process(shader)
		return shader
	}
}

