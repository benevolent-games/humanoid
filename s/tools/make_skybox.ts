
import {Scene} from "@babylonjs/core/scene.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {PBRMaterial} from "@babylonjs/core/Materials/PBR/pbrMaterial.js"
import {CubeTexture} from "@babylonjs/core/Materials/Textures/cubeTexture.js"
import {StandardMaterial} from "@babylonjs/core/Materials/standardMaterial.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {scalar} from "@benev/toolbox"

export function make_skybox({
			scene,
			yaw,
			size,
			urls,
		}: {
		scene: Scene
		yaw: number
		size: number
		urls: {
			px: string
			py: string
			pz: string
			nx: string
			ny: string
			nz: string
		}
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
			urls.px,
			urls.py,
			urls.pz,
			urls.nx,
			urls.ny,
			urls.nz,
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

