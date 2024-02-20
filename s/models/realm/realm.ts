
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {Meshoid, Physics, Porthole, Prop, Rapier, Stage, debug_colors} from "@benev/toolbox"

import {oneOff} from "../../tools/once.js"
import {RefStore} from "./parts/ref_store.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {SkyboxLinks} from "../../tools/make_skybox.js"
import {CharacterContainer} from "../character/container.js"

export type HumanoidLinks = {
	skybox: SkyboxLinks
	envmap: string
	assets: {
		gym: string
		character: string
		wrynth_dungeon: string
	}
}

export type HumanoidGlbs = {
	gym: () => Promise<AssetContainer>
	wrynth_dungeon: () => Promise<AssetContainer>
	character: () => Promise<CharacterContainer>
}

export type HumanoidRealm = {
	links: HumanoidLinks
	tickrate_hz: number
	stage: Stage
	colors: ReturnType<typeof debug_colors>
	impulse: HumanoidImpulse
	physics: Physics
	glbs: HumanoidGlbs
	stores: {
		meshes: RefStore<Meshoid>
		props: RefStore<Prop>
		physics_rigids: RefStore<Rapier.RigidBody>
	}
}

export async function makeRealm({links, tickrate_hz}: {
		links: HumanoidLinks
		tickrate_hz: number
	}): Promise<HumanoidRealm> {

	const impulse = new HumanoidImpulse()

	const stage = new Stage({
		background: Stage.backgrounds.sky(),
		tickrate_hz,
	})

	const colors = debug_colors(stage.scene)

	const physics = new Physics({
		hz: 60,
		colors,
		scene: stage.scene,
		gravity: [0, -9.81, 0],
	})

	const glbs: HumanoidGlbs = {
		gym: oneOff(
			() => stage.load_glb(links.assets.gym)
		),
		wrynth_dungeon: oneOff(
			() => stage.load_glb(links.assets.wrynth_dungeon)
		),
		character: oneOff(
			() => stage.load_glb(links.assets.character)
				.then(container => new CharacterContainer(container))
		),
	}

	return {
		tickrate_hz,
		stage,
		colors,
		impulse,
		physics,
		links,
		glbs,
		stores: {
			props: new RefStore<Prop>("props"),
			meshes: new RefStore<Meshoid>("meshes"),
			physics_rigids: new RefStore<Rapier.RigidBody>("physics_rigids"),
		},
	}
}

