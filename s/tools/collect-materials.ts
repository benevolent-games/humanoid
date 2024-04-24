
import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"

export function collectMaterials(meshes: AbstractMesh[]) {
	const pbr = new Set<PBRMaterial>()
	const standard = new Set<StandardMaterial>()
	const node = new Set<NodeMaterial>()

	for (const {material} of meshes) {
		if (material) {
			if (material instanceof PBRMaterial)
				pbr.add(material)
			else if (material instanceof StandardMaterial)
				standard.add(material)
			else if (material instanceof NodeMaterial)
				node.add(material)
		}
	}

	return {pbr, standard, node}
}

