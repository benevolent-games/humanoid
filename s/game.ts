
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent.js"

import {arch, hub} from "./ecs/hub.js"
import type {Game} from "./models/realm/types.js"
import {CommitHash} from "./tools/commit_hash.js"
import {LevelLoader} from "./models/levels/loader.js"
import startup_realm from "./startup/startup_realm.js"
import startup_gameloop from "./startup/startup_gameloop.js"
import startup_gamelogic from "./startup/startup_gamelogic.js"
import {blank_spawner_state} from "./ecs/logic/utils/spawns.js"
import startup_housekeeping from "./startup/startup_housekeeping.js"
import {AimTarget, Spawner} from "./ecs/components/plain_components.js"
import { hnexus } from "./dom/elements/benev-harness/nexus.js"

export {HeathenGame} from "./dom/views/heathen-game/view.js"

export async function loadHeathenGame(): Promise<Game> {
	const commit = CommitHash.parse_from_dom()
	const {quality} = hnexus.context.qualityMachine

	// realm contains all the global facilities for the game
	const realm = await startup_realm(commit, quality)

	// all our game logic is expressed in behaviors and systems
	const world = hub.world(realm)

	// preventing certain default browser keypress behaviors
	startup_housekeeping(realm)

	const executeGamelogic = startup_gamelogic(realm, world)

	// define the game, which extends the realm
	const game: Game = {
		...realm,
		world,
		levelLoader: new LevelLoader(realm, world),
	}

	// // telling the html frontend that the game is ready
	// hnexus.context.gameOp.setReady(game)

	// initial starting level
	await game.levelLoader.goto.viking_village()

	// spawner
	const spawner = blank_spawner_state()
	spawner.inputs.respawn = true
	spawner.inputs.bot_spawn = true
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

	return game
}

