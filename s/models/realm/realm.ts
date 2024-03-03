
import {Scene} from "@babylonjs/core/scene.js"
import {Stage, debug_colors} from "@benev/toolbox"

import {preparePhysics} from "./physics.js"
import {HuGameplan} from "../../gameplan.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {optimize_scene} from "../../tools/optimize_scene.js"
import {CharacterContainer} from "../character/container.js"

export type RealmParams = {
	tickrate_hz: number
	gameplan: HuGameplan
}

export type HuRealm = {
	scene: Scene
	stage: Stage
	impulse: HumanoidImpulse
	loadingDock: LoadingDock
	character: CharacterContainer
	colors: ReturnType<typeof debug_colors>
	physics: ReturnType<typeof preparePhysics>
} & RealmParams

export async function makeRealm(params: RealmParams): Promise<HuRealm> {
	const {gameplan, tickrate_hz} = params

	const stage = new Stage({
		background: Stage.backgrounds.sky(),
		tickrate_hz,
	})
	const {scene} = stage
	optimize_scene(scene)

	const loadingDock = new LoadingDock(scene)
	const impulse = new HumanoidImpulse()
	const colors = debug_colors(stage.scene)
	const physics = preparePhysics({scene, colors, hz: tickrate_hz})

	const character = new CharacterContainer(
		await loadingDock.loadGlb(
			// gameplan.characters.knight.glb
			gameplan.characters.pimsley.glb
		)
	)

	return {
		...params,
		scene,
		stage,
		loadingDock,
		impulse,
		colors,
		physics,
		character,
	}
}

