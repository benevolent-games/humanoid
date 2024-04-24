
import {clone, reactor} from "@benev/slate"
import {Bestorage, Stage, assignSelectively, debug_colors, defaultEffectsData} from "@benev/toolbox"

import {Ui} from "../ui/ui.js"
import {HuTact} from "../tact/tact.js"
import {HuPhysics} from "./physics.js"
import {Finder} from "../finder/finder.js"
import {HuGameplan} from "../../gameplan.js"
import {CommitHash} from "../../tools/commit_hash.js"
import {ShadowManager} from "./parts/shadow-manager.js"
import {LoadingDock} from "../planning/loading_dock.js"
// import {optimize_scene} from "../../tools/optimize_scene.js"

export type RealmParams = {
	allow_webgpu: boolean
	commit: CommitHash
	gameplan: HuGameplan
}

export type HuRealm = Awaited<ReturnType<typeof makeRealm>>

export async function makeRealm(params: RealmParams) {
	const {gameplan, commit} = params

	const ui = new Ui()

	const bestorage = new Bestorage({
		...defaultEffectsData(),
		shadows: clone(ui.shadows),
	})

	const stage = await Stage.create({
		bestorage,
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

	reactor.reaction(
		() => clone(ui.shadows),
		shadows => bestorage.data.shadows = shadows,
	)

	bestorage.onJson(({shadows: shadowsJson = bestorage.fallback.shadows}) => {
		assignSelectively(bestorage.fallback.shadows.basics, ui.shadows.basics, shadowsJson.basics)
		assignSelectively(bestorage.fallback.shadows.light, ui.shadows.light, shadowsJson.light)
		assignSelectively(bestorage.fallback.shadows.generator, ui.shadows.generator, shadowsJson.generator)
		assignSelectively(bestorage.fallback.shadows.cascaded, ui.shadows.cascaded, shadowsJson.cascaded)
	})

	// // disabled: because it breaks our postpro effects
	// optimize_scene(scene)

	const {scene} = stage
	const loadingDock = new LoadingDock(scene, commit)
	const tact = new HuTact()
	const colors = debug_colors(scene)
	const physics = new HuPhysics({scene, colors})

	const characterContainer = await loadingDock.loadGlb(
		gameplan.characters.pimsley.glb
	)

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
		shadowManager: new ShadowManager(),
	}
}

