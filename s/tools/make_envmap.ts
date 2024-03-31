
import {Scene} from "@babylonjs/core/scene"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"

import {CommitHash} from "./commit_hash.js"

export function make_envmap(scene: Scene, commit: CommitHash, link: string, rotation: number) {
	const hdrTexture = CubeTexture.CreateFromPrefilteredData(commit.augment(link), scene)
	scene.environmentTexture = hdrTexture
	hdrTexture.rotationY = rotation

	return {
		hdrTexture,
		dispose() {
			if (scene.environmentTexture === hdrTexture)
				scene.environmentTexture = null
			hdrTexture.dispose()
		},
	}
}

