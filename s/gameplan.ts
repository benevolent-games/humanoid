
import {scalar} from "@benev/toolbox"
import {Plan} from "./models/planning/plan.js"

export type HuGameplan = ReturnType<typeof make_gameplan>
export type HuLevel = keyof HuGameplan["levels"]
export type HuCharacter = keyof HuGameplan["characters"]
const kilometers = (m: number) => m * 1000
const degrees = scalar.radians.from.degrees

export const make_gameplan = Plan.gameplan(({
		local,
		quality,
		root_url,
		character, levels, glb, sky, env, shader, graphic,
	}) => ({

	quality,
	root_url,
	local,

	shaders: {
		mercury: shader("shaders/mercury/shader.json", {}),
		mountain: shader("shaders/mountain/shader.json", {}),
		"rock-large-01": shader("shaders/rock_large_01/shader.json", {}),
		skylight: shader("shaders/skylight/shader.json", {}),
		terrain: shader("shaders/terrain/shader.json", {}),
		terrain2: shader("shaders/terrain2/shader.json", {}),
		terrain3: shader("shaders/terrain3/shader.json", {}),
		water: shader("shaders/water/shader.json", {}),
	},

	graphics: {
		fog: graphic("graphics/fogplane3.webp"),
	},

	characters: {
		knight: character("glbs/characters/knight.glb"),
		pimsley: character("glbs/characters/mr_pimsley.glb"),
	},

	levels: levels({
		viking_village: {
			glb: glb("glbs/levels/viking_village.glb", "physics"),
			sky: sky("skyboxes/overcast_03", kilometers(1), degrees(270)),
			env: env("envmaps/viking_village.env", degrees(180)),
		},
		gym: {
			glb: glb("glbs/levels/gym.glb", "physics"),
			sky: sky("skyboxes/sky_01", kilometers(1), degrees(0)),
			env: env("envmaps/sunset_cloudy.env", degrees(90)),
		},
		// mountainside: {
		// 	glb: glb("glbs/levels/mountainside.glb", "physics"),
		// 	sky: sky("skyboxes/sky_01", kilometers(10), degrees(270)),
		// 	env: env("envmaps/sunset_cloudy.env", degrees(180)),
		// },
		// pillar_room: {
		// 	glb: glb("glbs/levels/pillar_room.glb", "physics"),
		// 	sky: sky("skyboxes/sky_01", kilometers(2), degrees(270)),
		// 	env: env("envmaps/wrynth_interior.env", degrees(90)),
		// },
		// wrynth_dungeon: {
		// 	glb: glb("glbs/levels/wrynth_dungeon.glb", "physics"),
		// 	sky: sky("skyboxes/sky_01", kilometers(2), degrees(270)),
		// 	env: env("envmaps/wrynth_interior.env", degrees(90)),
		// },
		// mt_finny: {
		// 	glb: glb("glbs/levels/mt_finny.glb", "physics"),
		// 	sky: sky("skyboxes/sky_01", kilometers(2), degrees(180)),
		// 	env: env("envmaps/sunset_cloudy.env", degrees(0)),
		// },
	}),
}))

