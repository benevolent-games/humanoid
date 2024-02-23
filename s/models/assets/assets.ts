
import {Pojo, ob} from "@benev/slate"
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {once} from "../../tools/once.js"
import {Quality} from "../../tools/quality.js"
import {make_envmap} from "../../tools/make_envmap.js"
import {AssetLinks} from "./parts/types.js"
import {SkyboxParams, make_skybox, skybox_image_links} from "../../tools/make_skybox.js"
import { GlbPostProcess } from "../glb_post_processing/parts/types.js"

export class Assets<L extends AssetLinks> {
	static links<A extends AssetLinks>(links: A) {
		return links
	}

	static glb_quality(url: string, quality: Quality) {
		const slashed = url.split("/")
		const filename = slashed.pop()!
		const dotted = filename.split(".")
		const extension = dotted.pop()!
		const name = dotted.join(".")
		return `${slashed.join("/")}/${name}.${quality}.${extension}`
	}

	#spec: L
	#scene: Scene
	#url = (path: string) => `${this.#spec.root}/${path}`
	#load_glb = async(url: string) => this.glb_post_process(
		await load_glb(this.#scene, url),
		this.#scene,
	)

	/** defaults to doing nothing -- set this if you want to process all loaded glbs */
	glb_post_process: GlbPostProcess = async asset => asset

	readonly glbs: {[K in keyof L["glbs"]]: Pojo<() => Promise<AssetContainer>>}
	readonly envmaps: {[K in keyof L["envmaps"]]: () => ReturnType<typeof make_envmap>}
	readonly skyboxes: {[K in keyof L["skyboxes"]]: ({}: SkyboxParams) => ReturnType<typeof make_skybox>}

	constructor({scene, quality, spec}: {
			spec: L
			scene: Scene
			quality: Quality
		}) {
		this.#spec = spec
		this.#scene = scene

		this.glbs = ob(spec.glbs).map(
			group => ob(group).map(
				link => once(async() => this.#load_glb(this.#url(Assets.glb_quality(link, quality))))
			)
		) as any

		this.envmaps = ob(spec.envmaps).map(
			link => () => make_envmap(scene, this.#url(link))
		) as any

		this.skyboxes = ob(spec.skyboxes).map(
			({directory, extension}) => (p: SkyboxParams) => make_skybox({
				...p,
				scene,
				links: skybox_image_links(this.#url(directory), extension),
			})
		) as any
	}
}

