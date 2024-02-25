
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"

import {Nametag} from "../../tools/nametag.js"
import {HumanoidRealm} from "../realm/realm.js"
import {GlbPostProcess} from "./parts/types.js"
import {Shader} from "../assets/parts/make_shader.js"

export function standard_glb_post_process({gameplan, loadingDock}: HumanoidRealm): GlbPostProcess {
	return async container => {
		const replacements = new Map<Material, Shader>()

		// load shaders
		for (const material of container.materials) {
			const nametag = Nametag.parse(material.name)
			if (nametag.tag("shader")) {
				const plan = gameplan.shaders[nametag.name as keyof typeof gameplan.shaders]
				const shader = await loadingDock.loadShader(plan)
				replacements.set(material, shader)
			}
		}

		// replace temp materials with shaders
		for (const mesh of container.meshes) {
			if (mesh instanceof Mesh && mesh.material) {
				const shader = replacements.get(mesh.material)
				if (shader) {
					mesh.material = shader.material
					console.log("shader replacement", mesh.name, shader.material.name)
				}
			}
		}

		return container
	}
}

