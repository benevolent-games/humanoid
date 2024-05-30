
import {nametag} from "@benev/toolbox"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Shader} from "./shader.js"
import {HuGameplan} from "../../../gameplan.js"
import {LoadingDock} from "../../planning/loading_dock.js"

export async function load_and_replace_shaders({
		gameplan,
		container,
		loadingDock,
	}: {
		gameplan: HuGameplan
		container: AssetContainer
		loadingDock: LoadingDock
	}) {

	const replacements = new Map<Material, Shader>()

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
}

