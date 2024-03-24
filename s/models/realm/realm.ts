
import {Scene} from "@babylonjs/core/scene.js"
import {Stage, debug_colors} from "@benev/toolbox"

import {HuTact} from "../tact/tact.js"
import {HuPhysics} from "./physics.js"
import {HuGameplan} from "../../gameplan.js"
import {ReticuleData, makeReticuleData} from "./reticule_data.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {optimize_scene} from "../../tools/optimize_scene.js"
import {CharacterContainer} from "../character/container.js"
import {Sensitivity, makeSensitivity} from "./sensitivity.js"

export type RealmParams = {
	tickrate_hz: number
	gameplan: HuGameplan
}

export type HuRealm = {
	scene: Scene
	stage: Stage
	tact: HuTact
	physics: HuPhysics
	loadingDock: LoadingDock
	sensitivity: Sensitivity
	reticuleData: ReticuleData
	character: CharacterContainer
	colors: ReturnType<typeof debug_colors>
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
	const tact = new HuTact()
	const colors = debug_colors(scene)
	const physics = new HuPhysics({scene, colors, hertz: tickrate_hz})

	const character = new CharacterContainer(
		await loadingDock.loadGlb(
			gameplan.characters.pimsley.glb
		)
	)

	return {
		...params,
		tact,
		scene,
		stage,
		colors,
		physics,
		character,
		loadingDock,
		sensitivity: makeSensitivity(),
		reticuleData: makeReticuleData(),
	}
}

