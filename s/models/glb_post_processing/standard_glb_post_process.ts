
import {HumanoidRealm} from "../realm/realm.js"
import {GlbPostProcess} from "./parts/types.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

export function standard_glb_post_process(realm: HumanoidRealm): GlbPostProcess {

	return async(container, scene) => {

		// load and apply shaders
		for (const material of container.materials) {
			if (material.name.includes("::shader")) {
				console.log("shader!")
			}
		}

		return container
	}
}

