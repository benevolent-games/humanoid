
console.log(`🏃 humanoid starting up`)

import {nexus} from "./nexus.js"
import startup_web_components from "./startup/startup_web_components.js"
import startup_realm from "./startup/startup_realm.js"
import startup_ecs from "./startup/startup_ecs.js"
import startup_housekeeping from "./startup/startup_housekeeping.js"
import startup_gameloop from "./startup/startup_gameloop.js"
import {LevelLoader} from "./models/level_loader/loader.js"
import {Game} from "./types.js"
import {arch} from "./ecs/hub.js"
import {Spawner} from "./ecs/components/plain_components.js"
import {blank_spawner_state} from "./ecs/logic/utils/spawns.js"
import {CommitHash} from "./tools/commit_hash.js"

const commit = CommitHash.parse_from_dom()
console.log(`🏷️ commit hash ${commit.short}`)

// html and ui
startup_web_components()

// realm contains all the global facilities for the game
const realm = await startup_realm(commit)

// all our game logic is expressed in behaviors and systems
const {world, executor} = startup_ecs(realm)

// preventing certain default browser keypress behaviors
startup_housekeeping(realm)

// running the actual gameloop tick
startup_gameloop(realm, executor)

// define the game, which extends the realm
const game: Game = {
	...realm,
	levelLoader: new LevelLoader(world, realm.gameplan),
}

// telling the html frontend that the game is ready
nexus.context.gameOp.setReady(game)

// initial starting level
await game.levelLoader.goto.viking_village()

// spawner
const spawner = blank_spawner_state()
spawner.inputs.respawn = true
world.create(arch({Spawner}, {spawner}))

// indicating that things are going well
console.log(`🏃 humanoid up and running`)

