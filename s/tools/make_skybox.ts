
import {Scene} from "@babylonjs/core/scene.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"

export type SkyboxLinks = {
	px: string
	py: string
	pz: string
	nx: string
	ny: string
	nz: string
}

export function make_image_based_lighting_environment(scene: Scene, link: string) {
	const hdrTexture = CubeTexture.CreateFromPrefilteredData(link, scene)
	scene.environmentTexture = hdrTexture
	return {
		dispose() {
			scene.environmentTexture = null
			hdrTexture.dispose()
		},
	}
}

export function make_skybox({
			scene,
			yaw,
			size,
			links,
		}: {
		scene: Scene
		yaw: number
		size: number
		links: SkyboxLinks
	}) {

	const box = MeshBuilder.CreateBox("skyBox", {size}, scene)
	box.infiniteDistance = true
	box.rotationQuaternion = (
		Quaternion.RotationYawPitchRoll(yaw, 0, 0)
	)

	const texture = (() => {
		const extensions = ["", "", "", "", "", ""]
		const noMipmap = false
		const files = [
			links.px,
			links.py,
			links.pz,
			links.nx,
			links.ny,
			links.nz,
		]
		return new CubeTexture(
			"",
			scene,
			extensions,
			noMipmap,
			files,
		)
	})()

	texture.coordinatesMode = Texture.SKYBOX_MODE

	const material = new StandardMaterial("skybox", scene)
	material.disableLighting = true
	material.backFaceCulling = false
	material.reflectionTexture = texture

	box.material = material

	return {
		box,
		material,
		texture,
		dispose() {
			texture.dispose()
			material.dispose()
			box.dispose()
		},
	}
}

