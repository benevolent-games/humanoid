
import {Stage, debug_colors} from "@benev/toolbox"

import {HuTact} from "../tact/tact.js"
import {HuPhysics} from "./physics.js"
import {HuGameplan} from "../../gameplan.js"
import {makeDebugState} from "./debug_state.js"
import {makeSensitivity} from "./sensitivity.js"
import {CommitHash} from "../../tools/commit_hash.js"
import {makeReticuleState} from "./reticule_state.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {optimize_scene} from "../../tools/optimize_scene.js"
import {CharacterContainer} from "../character/container.js"

export type RealmParams = {
	commit: CommitHash
	tickrate_hz: number
	gameplan: HuGameplan
}

export type HuRealm = Awaited<ReturnType<typeof makeRealm>>

export async function makeRealm(params: RealmParams) {
	const {gameplan, tickrate_hz, commit} = params

	const stage = new Stage({
		background: Stage.backgrounds.sky(),
		tickrate_hz,
	})
	const {scene} = stage
	optimize_scene(scene)

	const loadingDock = new LoadingDock(scene, commit)
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
		debug: makeDebugState(),
		sensitivity: makeSensitivity(),
		reticuleState: makeReticuleState(),
	}
}

