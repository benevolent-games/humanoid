
import {Scene} from "@babylonjs/core/scene.js"
import {Physics, Stage, debug_colors} from "@benev/toolbox"

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
	colors: ReturnType<typeof debug_colors>
	impulse: HumanoidImpulse
	physics: Physics
	loadingDock: LoadingDock
	character: CharacterContainer
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
	const physics = new Physics({
		hz: tickrate_hz,
		colors,
		scene: stage.scene,
		gravity: [0, -9.81, 0],
	})
	const character = new CharacterContainer(
		await loadingDock.loadGlb(
			gameplan.characters.knight.glb
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

