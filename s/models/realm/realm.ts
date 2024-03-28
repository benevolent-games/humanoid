
import {Ecs, Stage, debug_colors} from "@benev/toolbox"

import {HuTact} from "../tact/tact.js"
import {HuPhysics} from "./physics.js"
import {HuGameplan} from "../../gameplan.js"
import {Sensitivity, makeSensitivity} from "./sensitivity.js"
import {ReticuleState, makeReticuleState} from "./reticule_state.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {optimize_scene} from "../../tools/optimize_scene.js"
import {CharacterContainer} from "../character/container.js"
import { HuTick, hub } from "../../ecs/hub.js"
import { gamelogic } from "../../ecs/logic/gamelogic.js"
import { Scene } from "@babylonjs/core/scene.js"

export type RealmParams = {
	tickrate_hz: number
	gameplan: HuGameplan
}

export type HuRealm = Awaited<ReturnType<typeof makeRealm>>

// export type HuRealm = {
// 	scene: Scene
// 	stage: Stage
// 	tact: HuTact
// 	physics: HuPhysics
// 	loadingDock: LoadingDock
// 	sensitivity: Sensitivity
// 	reticuleState: ReticuleState
// 	character: CharacterContainer
// 	colors: ReturnType<typeof debug_colors>
// } & RealmParams

export async function makeRealm(params: RealmParams) {
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

	// const world = world(realm)
	// const executor = gamelogic.prepareExecutor({realm, world})

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
		reticuleState: makeReticuleState(),
	}
}

