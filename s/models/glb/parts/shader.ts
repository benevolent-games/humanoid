
import "@babylonjs/core/Materials/Node/Blocks/index.js"

import {is} from "@benev/slate"
import {label} from "@benev/toolbox"
import {Plan} from "../../planning/plan.js"
import {Scene} from "@babylonjs/core/scene.js"
import {CommitHash} from "../../../tools/commit_hash.js"
import {Texture} from "@babylonjs/core/Materials/Textures/texture.js"
import {NodeMaterial} from "@babylonjs/core/Materials/Node/nodeMaterial.js"
import {url_replace_extension} from "../../../tools/url_replace_extension.js"
import {InputBlock, PBRMetallicRoughnessBlock, ReflectionBlock, RefractionBlock} from "@babylonjs/core/Materials/Node/Blocks/index.js"

export class Shader<Inputs extends object = object> {

	static async make<I extends object>(
			scene: Scene,
			commit: CommitHash,
			{url, inputs, forced_extension_for_textures}: Plan.Shader<I>,
		) {
		NodeMaterial.IgnoreTexturesAtLoadTime = true
		const material = await NodeMaterial.ParseFromFileAsync(label("shader"), commit.augment(url), scene)
		material.name = label("shader")
		for (const texblock of material.getTextureBlocks()) {
			if (texblock instanceof ReflectionBlock || texblock instanceof RefractionBlock)
				texblock.texture = scene.environmentTexture
			else {
				const rebased_url = new URL(texblock.name, new URL(url, location.href)).href
				const new_url = url_replace_extension(rebased_url, forced_extension_for_textures)
				const texture = new Texture(commit.augment(new_url), scene)
				texblock.texture = texture
			}
		}
		return new Shader(material, inputs)
	}

	pbr: PBRMetallicRoughnessBlock | null = null
	#inputBlocks = new Map<string, InputBlock>()

	constructor(public readonly material: NodeMaterial, inputs: Inputs) {
		for (const block of material.getInputBlocks())
			this.#inputBlocks.set(block.name, block)

		for (const [key, value] of Object.entries(inputs))
			this.inputs[key as keyof Inputs] = value

		this.pbr = material.getBlockByPredicate(
			b => b instanceof PBRMetallicRoughnessBlock
		) as PBRMetallicRoughnessBlock | null
	}

	#getInputBlock(key: string) {
		const block = this.#inputBlocks.get(key)
		if (is.void(block))
			throw new Error(`missing block "${key}" on nodematerial "${this.material.name}"`)
		return block
	}

	readonly inputs: Inputs = new Proxy({}, {
		get: (_, key: string) => this.#getInputBlock(key).value,
		set: (_, key: string, value: any) => {
			this.#getInputBlock(key).value = value
			return true
		},
	}) as Inputs

	dispose() {
		this.material.dispose()
	}
}

