
import {Pojo, ob} from "@benev/slate"
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {once} from "../../tools/once.js"
import {AssetLinks} from "./parts/types.js"
import {Quality} from "../../tools/quality.js"
import {make_shader} from "./parts/make_shader.js"
import {make_envmap} from "../../tools/make_envmap.js"
import {add_quality_indicator_to_glb_url} from "./parts/helpers.js"
import {GlbPostProcess} from "../glb_post_processing/parts/types.js"
import {SkyboxParams, make_skybox, skybox_image_links} from "../../tools/make_skybox.js"

export class Assets<L extends AssetLinks> {
	static links<A extends AssetLinks>(links: A) { return links }

	/** prepend the current root directory onto a path and return a full url */
	readonly resolve = (path: string) => `${this.#spec.root}/${path}`

	/** defaults to doing nothing -- set this if you want to process all loaded glbs */
	glb_post_process: GlbPostProcess = async asset => asset

	readonly glbs: {[K in keyof L["glbs"]]: Pojo<() => Promise<AssetContainer>>}
	readonly envmaps: {[K in keyof L["envmaps"]]: () => ReturnType<typeof make_envmap>}
	readonly skyboxes: {[K in keyof L["skyboxes"]]: ({}: SkyboxParams) => ReturnType<typeof make_skybox>}
	readonly shaders: {[K in keyof L["shaders"]]: () => ReturnType<typeof make_shader>}

	#spec: L
	#scene: Scene
	#load_glb = async(url: string) => this.glb_post_process(
		await load_glb(this.#scene, url),
	)

	constructor({scene, quality, spec}: {
			spec: L
			scene: Scene
			quality: Quality
		}) {
		this.#spec = spec
		this.#scene = scene

		this.glbs = ob(spec.glbs).map(
			group => ob(group).map(
				link => once(async() => this.#load_glb(
					this.resolve(add_quality_indicator_to_glb_url(link, quality)))
				)
			)
		) as any

		this.envmaps = ob(spec.envmaps).map(
			link => () => make_envmap(scene, this.resolve(link))
		) as any

		this.skyboxes = ob(spec.skyboxes).map(
			({directory, extension}) => (p: SkyboxParams) => make_skybox({
				...p,
				scene,
				links: skybox_image_links(this.resolve(directory), extension),
			})
		) as any

		this.shaders = ob(spec.shaders).map(
			({path, inputs}) => () => make_shader(scene, this.resolve(path), inputs)
		) as any
	}
}

