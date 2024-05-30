
import {PointLight} from "@babylonjs/core/Lights/pointLight.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export function kill_lights(container: AssetContainer) {
	for (const light of [...container.lights]) {
		if (light instanceof PointLight) {
			console.log("disposed", light.name)
			light.dispose()
		}
	}
}

