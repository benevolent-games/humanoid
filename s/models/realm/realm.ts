
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
import {standard_glb_post_process} from "../glb/standard_glb_post_process.js"

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
		particleFog: clone(ui.particleFog),
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

	reactor.reaction(
		() => clone(ui.particleFog),
		particleFog => bestorage.data.particleFog = particleFog,
	)

	bestorage.onJson(({shadows: json = bestorage.fallback.shadows}) => {
		assignSelectively(bestorage.fallback.shadows.basics, ui.shadows.basics, json.basics)
		assignSelectively(bestorage.fallback.shadows.light, ui.shadows.light, json.light)
		assignSelectively(bestorage.fallback.shadows.generator, ui.shadows.generator, json.generator)
		assignSelectively(bestorage.fallback.shadows.cascaded, ui.shadows.cascaded, json.cascaded)
	})

	bestorage.onJson(({particleFog: json = bestorage.fallback.particleFog}) => {
		assignSelectively(bestorage.fallback.particleFog, ui.particleFog, json)
	})

	const {scene} = stage
	const loadingDock = new LoadingDock(scene, commit)
	const tact = new HuTact()
	const colors = debug_colors(scene)
	const physics = new HuPhysics({scene, colors})

	// our standard glb postpro will apply shaders and stuff like that,
	// before it's copied to the scene.
	loadingDock.glb_post_process = standard_glb_post_process({gameplan, loadingDock})

	// hack specular fix on node material shaders
	loadingDock.shader_post_process = async shader => {
		if (shader.pbr)
			shader.pbr.specularIntensity = 0.2
	}

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

