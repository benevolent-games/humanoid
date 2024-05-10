
import {fix_animation_groups, nametag, nquery} from "@benev/toolbox"

import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

import {Shader} from "./parts/shader.js"
import {HuGameplan} from "../../gameplan.js"
import {GlbPostProcess} from "./parts/types.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {isFoliage, isHair} from "./parts/mesh-filters.js"
import {PointLight} from "@babylonjs/core/Lights/pointLight.js"
import {collectMaterials} from "../../tools/collect-materials.js"

export function standard_glb_post_process({gameplan, loadingDock}: {
		gameplan: HuGameplan
		loadingDock: LoadingDock
	}): GlbPostProcess {

	const {quality} = gameplan

	const maxLights = (
		quality === "fancy" ? 16 :
		quality === "mid" ? 8 :
		2
	)

	const allowFoliage = (
		quality === "fancy" ? true :
		quality === "mid" ? true :
		false
	)

	return async container => {
		const replacements = new Map<Material, Shader>()

		for (const light of [...container.lights]) {
			if (light instanceof PointLight) {
				console.log("disposed", light.name)
				light.dispose()
			}
		}

		// load shaders
		for (const material of container.materials) {
			const tag = nametag(material.name)
			if (tag.get("shader")) {
				const name = tag.name as keyof typeof gameplan.shaders
				if (name in gameplan.shaders) {
					const plan = gameplan.shaders[name]
					const shader = await loadingDock.loadShader(plan, material.name)
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
				if (shader)
					mesh.material = shader.material
			}
		}

		// replace temp materials with shaders
		for (const mesh of container.meshes) {
			if (mesh instanceof Mesh && mesh.material) {
				const shader = replacements.get(mesh.material)
				if (shader)
					mesh.material = shader.material
			}
		}

		// set max light limit
		for (const material of container.materials) {
			if (material instanceof PBRMaterial || material instanceof NodeMaterial)
				material.maxSimultaneousLights = maxLights
		}

		// fix animations
		fix_animation_groups(container.animationGroups)

		// foliage settings
		const foliageMeshes = container.meshes.filter(isFoliage)
		const foliageMaterials = collectMaterials(foliageMeshes).pbr
		if (!allowFoliage) {
			for (const mesh of foliageMeshes)
				mesh.dispose()
		}
		else {
			for (const material of foliageMaterials) {
				material.twoSidedLighting = false
				material.backFaceCulling = true
				material.forceNormalForward = true
			}
		}
	}
}

