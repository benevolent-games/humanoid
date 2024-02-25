
console.log("🤖 humanoid starting up")

import {scalar} from "@benev/toolbox"
import {register_to_dom} from "@benev/slate"

// import "@babylonjs/core/Culling/ray.js"
// import "@babylonjs/loaders/glTF/index.js"
// import "@babylonjs/core/Engines/index.js"
// import "@babylonjs/core/Animations/index.js"
// import "@babylonjs/core/Rendering/edgesRenderer.js"
// import "@babylonjs/core/Physics/physicsEngineComponent.js"
// import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"
// import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
// import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader.js"
// import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {nexus} from "./nexus.js"
import {root} from "./ecs/logic/root.js"
import {Quality} from "./tools/quality.js"
import {make_gameplan} from "./gameplan.js"
import {HumanoidTick, hub} from "./ecs/hub.js"
import {makeRealm} from "./models/realm/realm.js"
import {Respawner} from "./models/respawner/respawner.js"
import {LevelSwitcher} from "./models/level_switcher/switcher.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import {determine_quality_mode} from "./tools/determine_quality_mode.js"
import {determine_local_dev_mode} from "./tools/determine_local_dev_mode.js"
import {standard_glb_post_process} from "./models/glb_post_processing/standard_glb_post_process.js"

//
// initial window-dressings
//

// prevent problematic key behaviors that interfere with our gameplay keybinds
function defaultPreventer(event: KeyboardEvent) {
	if (event.altKey || event.code === "AltLeft")
		event.preventDefault()
	if (event.code === "Tab")
		event.preventDefault()
}
window.addEventListener("keydown", defaultPreventer)
window.addEventListener("keyup", defaultPreventer)

// warn users before they kill the browser tab,
// people hit ctrl+w a lot while walking around and accidentally kill the game,
// this helps prevent that
window.onbeforeunload = (event: Event) => {
	event.preventDefault()
	return "woah, are you sure you want to close the game?"
}

//
// dom registration
//  - we register our web components to the dom
//  - this places the canvas and all of our ui
//

register_to_dom({BenevHumanoid})
;(window as any).nexus = nexus

//
// realm initialization
//  - the realm is kind of the container of the 3d world
//  - this bootstraps our babylonjs engine and scene
//  - we are using an op for the async operation so the ui can show a loading spinner
//

const gameplan = make_gameplan(
	determine_local_dev_mode(location.href)
)

const realm = (window as any).realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		gameplan,
		tickrate_hz: 60,
		quality: determine_quality_mode(location.href, Quality.Mid),
	})
)

// we lower the resolution for potato-computers
realm.stage.porthole.resolution = realm.quality === Quality.Potato
	? 0.5
	: 1

// our standard glb postpro will apply shaders and stuff like that,
// before it's copied to the scene.
realm.loadingDock.glb_post_process = standard_glb_post_process(realm)

//
// ecs startup
//  - all our game logic uses entity component system architecture
//

const world = hub.world(realm)
const executive = hub.executive(realm, world, root)

// establish a level switcher for cycling levels
const levelSwitcher = new LevelSwitcher(world, gameplan)
levelSwitcher.next()

// establish the zone available to the ui
nexus.context.zoneOp.setReady({levelSwitcher})

// switch level when we press the key
realm.impulse.on.universal.buttons.level_swap(button => {
	if (button.down && !button.repeat)
		levelSwitcher.next()
})

const respawner = new Respawner(world)
respawner.respawn()
realm.impulse.on.universal.buttons.respawn(button => {
	if (button.down && !button.repeat)
		respawner.respawn()
})

//
// start the game
//  - render loop
//  - physics loop
//  - game tick loop
//

let count = 0
let gametime = 0
let last_time = performance.now()

realm.stage.gameloop.onTick(() => {
	const last = last_time
	realm.physics.step()

	const seconds = scalar.clamp(
		((last_time = performance.now()) - last),
		0,
		1000 / 30, // clamp delta to avoid large over-corrections
	) / 1000

	gametime += seconds

	const tick: HumanoidTick = {
		seconds,
		gametime,
		count: count++,
		hz: 1 / seconds,
	}

	executive.execute(tick)
})

realm.stage.gameloop.start()

console.log("🏃 humanoid up and running")

