
import {Pojo, ob} from "@benev/slate"
import {load_glb} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {once} from "../../tools/once.js"
import {make_envmap} from "../../tools/make_envmap.js"
import {SkyboxParams, make_skybox, skybox_image_links} from "../../tools/make_skybox.js"

export type AssetLinks = {
	root: string
	glbs: {
		levels: Pojo<string>
		characters: Pojo<string>
	}
	shaders: Pojo<string>
	envmaps: Pojo<string>
	skyboxes: Pojo<{
		directory: string
		extension: string
	}>
}

export class Assets<L extends AssetLinks> {
	static links<A extends AssetLinks>(links: A) {
		return links
	}

	#scene: Scene
	#spec: L
	#load_glb = async(url: string) => load_glb(this.#scene, url)
	#url = (path: string) => `${this.#spec.root}/${path}`

	readonly glbs: {[K in keyof L["glbs"]]: Pojo<() => Promise<AssetContainer>>}
	readonly envmaps: {[K in keyof L["envmaps"]]: () => ReturnType<typeof make_envmap>}
	readonly skyboxes: {[K in keyof L["skyboxes"]]: ({}: SkyboxParams) => ReturnType<typeof make_skybox>}

	constructor(scene: Scene, spec: L) {
		this.#scene = scene
		this.#spec = spec

		this.glbs = ob(this.#spec.glbs).map(
			group => ob(group).map(
				link => once(async() => this.#load_glb(this.#url(link)))
			)
		) as any

		this.envmaps = ob(this.#spec.envmaps).map(
			link => make_envmap(scene, this.#url(link))
		) as any

		this.skyboxes = ob(this.#spec.skyboxes).map(
			({directory, extension}) => (p: SkyboxParams) => make_skybox({
				...p,
				scene,
				links: skybox_image_links(directory, extension),
			})
		) as any
	}
}

// const glbs: HumanoidGlbs = {
// 	gym: once(
// 		() => stage.load_glb(links.assets.gym)
// 	),
// 	mt_pimsley: once(
// 		() => stage.load_glb(links.assets.mt_pimsley)
// 	),
// 	teleporter: once(
// 		() => stage.load_glb(links.assets.teleporter)
// 	),
// 	wrynth_dungeon: once(
// 		() => stage.load_glb(links.assets.wrynth_dungeon)
// 	),
// 	character: once(
// 		() => stage.load_glb(links.assets.character)
// 			.then(container => new CharacterContainer(container))
// 	),
// }

