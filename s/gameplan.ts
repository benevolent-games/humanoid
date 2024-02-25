
import {degrees, env, glb, kilometers, levels, sky} from "./models/planning/helpers.js"

export type HuGameplan = ReturnType<typeof gameplan>
export type HuLevelName = keyof HuGameplan["levels"]

export const gameplan = (local_dev_mode: boolean) => ({
	root: local_dev_mode ?
		"/assets" :
		"https://benev-storage.sfo2.cdn.digitaloceanspaces.com/x/assets",

	shaders: {
		terrain: {
			path: "shaders/terrain/shader.json",
			inputs: {},
		},
	},

	...levels({
		gym: {
			glb: glb("glbs/levels/gym.glb"),
			sky: sky("glbs/skyboxes/sky_01", ".webp", kilometers(1), degrees(180)),
			env: env("envmaps/wrynth_interior.env", degrees(270)),
		},
		mt_pimsley: {
			glb: glb("glbs/levels/mt_pimsley.glb"),
			sky: sky("glbs/skyboxes/sky_01", ".webp", kilometers(1), degrees(180)),
			env: env("envmaps/wrynth_interior.env", degrees(270)),
		},
		teleporter: {
			glb: glb("glbs/levels/teleporter.glb"),
			sky: sky("glbs/skyboxes/sky_01", ".webp", kilometers(1), degrees(180)),
			env: env("envmaps/wrynth_interior.env", degrees(270)),
		},
		wrynth_dungeon: {
			glb: glb("glbs/levels/wrynth_dungeon.glb"),
			sky: sky("glbs/skyboxes/sky_01", ".webp", kilometers(1), degrees(180)),
			env: env("envmaps/wrynth_interior.env", degrees(270)),
		},
	}).cycle(
		"mt_pimsley",
		"gym",
		"teleporter",
		"wrynth_dungeon",
	),
})

