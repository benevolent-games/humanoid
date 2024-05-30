
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {isFoliage} from "./mesh-filters.js"
import {collectMaterials} from "../../../tools/collect-materials.js"

export function config_foliage({
		container,
		allowFoliage,
	}: {
		container: AssetContainer
		allowFoliage: boolean
	}) {

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

	container.meshes = container.meshes.filter(m => !m.isDisposed())
}

