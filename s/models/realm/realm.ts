
import {Bestorage, Stage, debug_colors, defaultEffectsData} from "@benev/toolbox"

import {Ui} from "../ui/ui.js"
import {HuTact} from "../tact/tact.js"
import {HuPhysics} from "./physics.js"
import {HuGameplan} from "../../gameplan.js"
import {CommitHash} from "../../tools/commit_hash.js"
import {LoadingDock} from "../planning/loading_dock.js"
import { Finder } from "../finder/finder.js"
import { clone } from "@benev/slate"
// import {optimize_scene} from "../../tools/optimize_scene.js"

export type RealmParams = {
	allow_webgpu: boolean
	commit: CommitHash
	gameplan: HuGameplan
}

export type HuRealm = Awaited<ReturnType<typeof makeRealm>>

export async function makeRealm(params: RealmParams) {
	const {gameplan, commit} = params

	const stage = await Stage.create({
		background: Stage.backgrounds.sky(),
		allow_webgpu: params.allow_webgpu,
		webgl_options: {
			alpha: false,
			desynchronized: true,
			preserveDrawingBuffer: false,
		},
		webgpu_options: {
			antialias: true,
			audioEngine: true,
			powerPreference: "high-performance",
		},
	})

	const {scene} = stage

	// // disabled: because it breaks our postpro effects
	// optimize_scene(scene)

	const loadingDock = new LoadingDock(scene, commit)
	const tact = new HuTact()
	const colors = debug_colors(scene)
	const physics = new HuPhysics({scene, colors})

	const characterContainer = await loadingDock.loadGlb(
		gameplan.characters.pimsley.glb
	)

	const ui = new Ui()
	const bestorage = new Bestorage({
		...defaultEffectsData(),
		resolution: stage.porthole.resolution * 100,
		shadows: clone(ui.shadows),
	})

	return {
		...params,
		ui,
		tact,
		scene,
		stage,
		colors,
		physics,
		bestorage,
		loadingDock,
		characterContainer,
		finder: new Finder(physics),
	}
}

