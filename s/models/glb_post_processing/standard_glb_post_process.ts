
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

import {Nametag} from "../../tools/nametag.js"
import {HumanoidRealm} from "../realm/realm.js"
import {GlbPostProcess} from "./parts/types.js"

export function standard_glb_post_process({assets}: HumanoidRealm): GlbPostProcess {
	return async container => {
		const replacements = new Map<Material, NodeMaterial>()

		// load shaders
		for (const material of container.materials) {
			if (Nametag.parse(material.name).tag("shader")) {
				console.log("shader!", material.name)
				const shader = await assets.shaders.terrain()
				replacements.set(material, shader)
			}
		}

		// replace temp materials with shaders
		for (const mesh of container.meshes) {
			if (mesh instanceof Mesh && mesh.material) {
				const shader = replacements.get(mesh.material)
				if (shader) {
					mesh.material = shader
					console.log("shader replacement", mesh.name, shader.name)
				}
			}
		}

		return container
	}
}

