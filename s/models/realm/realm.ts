
import {Physics, Stage, debug_colors} from "@benev/toolbox"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

import {Assets, Quality} from "../assets/assets.js"
import {assetLinks} from "../../asset_links.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {CharacterContainer} from "../character/container.js"

export type HumanoidGlbs = {
	gym: () => Promise<AssetContainer>
	mt_pimsley: () => Promise<AssetContainer>
	teleporter: () => Promise<AssetContainer>
	wrynth_dungeon: () => Promise<AssetContainer>
	character: () => Promise<CharacterContainer>
}

export type HumanoidRealm = {
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

	const assets = new Assets(stage.scene, quality, assetLinks(local_dev_mode))

	const impulse = new HumanoidImpulse()

	const colors = debug_colors(stage.scene)

	const physics = new Physics({
		hz: 60,
		colors,
		scene: stage.scene,
		gravity: [0, -9.81, 0],
	})

	return {
		quality,
		local_dev_mode,
		tickrate_hz,
		stage,
		assets,
		impulse,
		colors,
		physics,
	}
}

