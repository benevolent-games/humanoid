
import {fix_animation_groups, nametag} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

import {HuRealm} from "../realm/realm.js"
import {GlbPostProcess} from "./parts/types.js"
import {Shader} from "../assets/parts/make_shader.js"

export function standard_glb_post_process({gameplan, loadingDock}: HuRealm): GlbPostProcess {
	const {quality} = gameplan

	return async container => {
		const replacements = new Map<Material, Shader>()

		// load shaders
		for (const material of container.materials) {
			const tag = nametag(material.name)
			if (tag.get("shader")) {
				const name = tag.name as keyof typeof gameplan.shaders
				if (name in gameplan.shaders) {
					const plan = gameplan.shaders[name]
					const shader = await loadingDock.loadShader(plan)
					replacements.set(material, shader)
				}
				else {
					console.warn(`shader not found "${name}"`)
				}
			}
		}

		// replace temp materials with shaders
		for (const mesh of container.meshes) {
			if (mesh instanceof Mesh && mesh.material) {
				const shader = replacements.get(mesh.material)
				if (shader) {
					mesh.material = shader.material
				}
			}
		}

		const maxLights = (
			quality === "fancy" ? 16 :
			quality === "mid" ? 8 :
			2
		)

		// set max light limit
		for (const material of container.materials) {
			if (material instanceof PBRMaterial || material instanceof NodeMaterial)
				material.maxSimultaneousLights = maxLights
		}

		fix_animation_groups(container.animationGroups)

		return container
	}
}

