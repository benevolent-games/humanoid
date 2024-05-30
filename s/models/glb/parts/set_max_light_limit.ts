
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

export function set_max_light_limit({container, maxLights}: {
		container: AssetContainer
		maxLights: number
	}) {

	for (const material of container.materials) {
		if (material instanceof PBRMaterial || material instanceof NodeMaterial)
			material.maxSimultaneousLights = maxLights
	}
}

