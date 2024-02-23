
import {Scene} from "@babylonjs/core/scene.js"
import {Physics, Stage, debug_colors} from "@benev/toolbox"

import {Assets} from "../assets/assets.js"
import {Quality} from "../../tools/quality.js"
import {assetLinks} from "../../asset_links.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {optimize_scene} from "../../tools/optimize_scene.js"

export type HumanoidRealm = {
	scene: Scene
	quality: Quality
	local_dev_mode: boolean
	tickrate_hz: number
	stage: Stage
	colors: ReturnType<typeof debug_colors>
	impulse: HumanoidImpulse
	physics: Physics
	assets: Assets<ReturnType<typeof assetLinks>>
}

export async function makeRealm(params: {
		quality: Quality
		tickrate_hz: number
		local_dev_mode: boolean
	}): Promise<HumanoidRealm> {

	const {quality, tickrate_hz, local_dev_mode} = params

	const stage = new Stage({
		background: Stage.backgrounds.sky(),
		tickrate_hz,
	})

	optimize_scene(stage.scene)

	const assets = new Assets({
		quality,
		scene: stage.scene,
		spec: assetLinks(local_dev_mode),
	})

	const impulse = new HumanoidImpulse()

	const colors = debug_colors(stage.scene)

	const physics = new Physics({
		hz: 60,
		colors,
		scene: stage.scene,
		gravity: [0, -9.81, 0],
	})

	return {
		...params,
		scene: stage.scene,
		stage,
		assets,
		impulse,
		colors,
		physics,
	}
}

