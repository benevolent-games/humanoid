
import "@babylonjs/core/Materials/Node/Blocks/index.js"

import {label} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"
import {InputBlock, ReflectionBlock, TextureBlock} from "@babylonjs/core/Materials/Node/Blocks/index.js"

export class Shader<Inputs extends object = object> {
	constructor(public readonly material: NodeMaterial) {}

	// TODO
	readonly inputs: Inputs = {} as any

	dispose() { this.material.dispose() }
}

export async function make_shader(
		scene: Scene,
		url: string,
	) {

	NodeMaterial.IgnoreTexturesAtLoadTime = true
	const material = await NodeMaterial.ParseFromFileAsync(label("shader"), url, scene)
	material.name = label("shader")

	console.log("shader", url)

	for (const texblock of material.getTextureBlocks()) {
		if (texblock instanceof ReflectionBlock) {
			texblock.texture = scene.environmentTexture
		}
		else {
			if (texblock instanceof TextureBlock) {
				// TODO what even is this?
				// https://forum.babylonjs.com/t/nme-make-texture-level-work-for-normal-maps-as-it-does-in-other-materials/19443
				texblock.level
			}
			const {href} = new URL(texblock.name, new URL(url, location.href))
			console.log(" - texture:", texblock.name, href)
			// const texture = new Texture(href, scene, {invertY: false})
			const texture = new Texture(href, scene)
			texblock.texture = texture
		}
	}

	// // TODO implement into shader instance
	// for (const [key, value] of Object.entries(inputs)) {
	// 	const block = material.getBlockByName(key)
	// 	if (block) {
	// 		if (block instanceof InputBlock)
	// 			block.value = value
	// 		else
	// 			console.warn(`the shader input called "${key}" matches the wrong kind of block, which is actually a ${block.getClassName()}`)
	// 	}
	// 	else
	// 		console.warn(`the shader input called "${key}" is not found`)
	// }

	return new Shader(material)
}

