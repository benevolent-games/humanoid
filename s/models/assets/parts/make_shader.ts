
import "@babylonjs/core/Materials/Node/Blocks/index.js"

import {label} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {InputBlock} from "@babylonjs/core/Materials/Node/Blocks/index.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"

export async function make_shader(
		scene: Scene,
		url: string,
		inputs: any,
	) {

	NodeMaterial.IgnoreTexturesAtLoadTime = true
	const material = await NodeMaterial.ParseFromFileAsync(label("shader"), url, scene)
	material.name = label("shader")

	console.log("shader", url)

	for (const texblock of material.getTextureBlocks()) {
		const {href} = new URL(texblock.name, new URL(url, location.href))
		console.log(" - texture:", texblock.name, href)
		const texture = new Texture(href, scene)
		texblock.texture = texture
	}

	for (const [key, value] of Object.entries(inputs)) {
		const block = material.getBlockByName(key)
		if (block) {
			if (block instanceof InputBlock)
				block.value = value
			else
				console.warn(`the shader input called "${key}" matches the wrong kind of block, which is actually a ${block.getClassName()}`)
		}
		else
			console.warn(`the shader input called "${key}" is not found`)
	}

	return material
}

