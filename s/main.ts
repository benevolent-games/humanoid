
console.log(`🏃 humanoid starting up`)

import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent.js"

import {clone, debounce, reactor} from "@benev/slate"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"

import {Game} from "./types.js"
import {nexus} from "./nexus.js"
import {arch, hub} from "./ecs/hub.js"
import {CommitHash} from "./tools/commit_hash.js"
import startup_realm from "./startup/startup_realm.js"
import {LevelLoader} from "./models/level_loader/loader.js"
import {AimTarget, Spawner} from "./ecs/components/plain_components.js"
import startup_gameloop from "./startup/startup_gameloop.js"
import {blank_spawner_state} from "./ecs/logic/utils/spawns.js"
import startup_housekeeping from "./startup/startup_housekeeping.js"
import startup_web_components from "./startup/startup_web_components.js"
import startup_gamelogic from "./startup/startup_gamelogic.js"
import { Ui } from "./models/ui/ui.js"
import { nquery } from "@benev/toolbox"

const commit = CommitHash.parse_from_dom()

// html and ui
startup_web_components()

// realm contains all the global facilities for the game
const realm = await startup_realm(commit)

// all our game logic is expressed in behaviors and systems
const world = hub.world(realm)

// preventing certain default browser keypress behaviors
startup_housekeeping(realm)

const executeGamelogic = startup_gamelogic(realm, world)

// define the game, which extends the realm
const game: Game = {
	...realm,
	levelLoader: new LevelLoader(world, realm.gameplan),
}

// telling the html frontend that the game is ready
nexus.context.gameOp.setReady(game)

// initial starting level
const levelState = await game.levelLoader.goto.viking_village()
{
	const sunlight = levelState.stuff.level.lights[0] as DirectionalLight
	let shadowGenerator: ShadowGenerator | CascadedShadowGenerator

	const applyShadowSettings = debounce(100, (data: Ui["shadows"]) => {
		if (shadowGenerator)
			shadowGenerator.dispose()

		const d = game.ui.shadows.basics.sunDistance
		sunlight.position.copyFrom(sunlight.direction.multiplyByFloats(-d, -d, -d))

		Object.assign(sunlight, data.light)

		if (data.cascaded.enabled) {
			shadowGenerator = new CascadedShadowGenerator(data.generator.mapSize, sunlight)
			shadowGenerator.filteringQuality = data.basics.filteringQuality
			Object.assign(shadowGenerator, data.generator, data.cascaded)
		}
		else {
			shadowGenerator = new ShadowGenerator(data.generator.mapSize, sunlight)
			shadowGenerator.filteringQuality = data.basics.filteringQuality
			Object.assign(shadowGenerator, data.generator)
		}

		for (const mesh of levelState.stuff.level.meshes) {
			if (nquery(mesh).tag("grass") || nquery(mesh).name("grass")) {
				mesh.receiveShadows = data.basics.grass_receives_shadows
				if (data.basics.grass_casts_shadows)
					shadowGenerator.addShadowCaster(mesh)
			}
			else {
				mesh.receiveShadows = true
				shadowGenerator.addShadowCaster(mesh)
			}
		}
	})

	reactor.reaction(
		() => clone(game.ui.shadows),
		applyShadowSettings,
	)

	applyShadowSettings(clone(game.ui.shadows))
}

// spawner
const spawner = blank_spawner_state()
spawner.inputs.respawn = true
spawner.inputs.bot_spawn = false
world.create(arch({Spawner}, {spawner}))

world.create(arch({AimTarget}, {aimTarget: {
	targetEntityId: null,
	recentTargetEntityId: null,
	lastAimTime: 0,
}}))

// running the actual gameloop tick
startup_gameloop(realm, executeGamelogic)

// indicating that things are going well
console.log(`🏃 humanoid ready, took ${(performance.now() / 1000).toFixed(1)} seconds.`)

