
import {Scene} from "@babylonjs/core/scene"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"

export function make_envmap(scene: Scene, link: string) {
	const hdrTexture = CubeTexture.CreateFromPrefilteredData(link, scene)
	scene.environmentTexture = hdrTexture
	return {
		hdrTexture,
		dispose() {
			if (scene.environmentTexture === hdrTexture)
				scene.environmentTexture = null
			hdrTexture.dispose()
		},
	}
}

