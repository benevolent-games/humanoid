
import {game, degrees, env, glb, kilometers, levels, sky, character} from "./models/planning/helpers.js"

export type HuGameplan = ReturnType<typeof make_gameplan>
export type HuLevel = keyof HuGameplan["levels"]
export type HuCharacter = keyof HuGameplan["characters"]

export const make_gameplan = (local_dev_mode: boolean) => game({
	root: local_dev_mode ?
		"/assets" :
		"https://benev-storage.sfo2.cdn.digitaloceanspaces.com/x/assets",

	shaders: {
		terrain: {
			path: "shaders/terrain/shader.json",
			inputs: {},
		},
		skylight: {
			path: "shaders/skylight/shader.json",
			inputs: {},
		},
		mercury: {
			path: "shaders/mercury/shader.json",
			inputs: {},
		},
		water: {
			path: "shaders/water/shader.json",
			inputs: {},
		},
	},

	characters: {
		knight: character("glbs/characters/knight.glb"),
	},

	...levels({
		gym: {
			glb: glb("glbs/levels/gym.glb", "physics"),
			sky: sky("skyboxes/sky_01", ".webp", kilometers(2), degrees(270)),
			env: env("envmaps/wrynth_interior.env", degrees(90)),
		},
		mt_pimsley: {
			glb: glb("glbs/levels/mt_pimsley.glb", "physics"),
			sky: sky("skyboxes/sky_01", ".webp", kilometers(2), degrees(270)),
			env: env("envmaps/sunset_cloudy.env", degrees(180)),
		},
		teleporter: {
			glb: glb("glbs/levels/teleporter.glb", "physics"),
			sky: sky("skyboxes/sky_01", ".webp", kilometers(2), degrees(270)),
			env: env("envmaps/wrynth_interior.env", degrees(90)),
		},
		wrynth_dungeon: {
			glb: glb("glbs/levels/wrynth_dungeon.glb", "physics"),
			sky: sky("skyboxes/sky_01", ".webp", kilometers(2), degrees(270)),
			env: env("envmaps/wrynth_interior.env", degrees(90)),
		},
	}).cycle(
		"gym",
		"mt_pimsley",
		"teleporter",
		"wrynth_dungeon",
	),
})

