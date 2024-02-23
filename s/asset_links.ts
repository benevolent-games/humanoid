
import {Assets} from "./models/assets/assets.js"

export type HumanoidAssetLinks = ReturnType<typeof assetLinks>
export type HumanoidAssets = Assets<HumanoidAssetLinks>

export const assetLinks = (local_dev_mode: boolean) => Assets.links({

	root: local_dev_mode ?
		"/assets" :
		"https://benev-storage.sfo2.cdn.digitaloceanspaces.com/x/assets",

	glbs: {
		levels: {
			gym: "glbs/levels/gym15.glb",
			mt_pimsley: "glbs/levels/mt_pimsley47.glb",
			teleporter: "glbs/levels/teleporter47.glb",
			wrynth_dungeon: "glbs/levels/wrynth_dungeon47.glb",
		},
		characters: {
			knight: "knight43.glb"
		},
	},

	envmaps: {
		wrynth_interior: "envmaps/wrynthinteriors2.env",
	},

	skyboxes: {
		sky_01: {
			directory: "skyboxes/sky_01",
			extension: ".webp",
		},
	},

	shaders: {},
})

