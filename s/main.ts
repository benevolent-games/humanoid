
console.log("🤖 humanoid")

import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Physics/physicsEngineComponent.js"
import "@babylonjs/core/Rendering/depthRendererSceneComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Materials/Textures/Loaders/envTextureLoader.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {scalar} from "@benev/toolbox"
import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {root} from "./ecs/logic/root.js"
import {HumanoidTick, hub} from "./ecs/hub.js"
import {makeRealm} from "./models/realm/realm.js"
import {Archetypes} from "./ecs/archetypes/archetypes.js"
import {LevelSwitcher} from "./models/level_switcher/switcher.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import {determine_local_dev_mode} from "./tools/determine_local_dev_mode.js"

register_to_dom({BenevHumanoid})
;(window as any).nexus = nexus

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		local_dev_mode: determine_local_dev_mode(),
		tickrate_hz: 60,
	})
)

realm.stage.porthole.resolution = realm.local_dev_mode
	? 0.5
	: 1

const world = hub.world(realm)
const executive = hub.executive(realm, world, root)
const levelSwitcher = new LevelSwitcher(realm, world)

levelSwitcher.toggle()

realm.impulse.on.universal.buttons.level_swap(button => {
	if (button.down && !button.repeat)
		levelSwitcher.toggle()
})

function defaultPreventer(event: KeyboardEvent) {
	if (event.altKey || event.code === "AltLeft")
		event.preventDefault()
}
window.addEventListener("keydown", defaultPreventer)
window.addEventListener("keyup", defaultPreventer)

window.onbeforeunload = (event: Event) => {
	event.preventDefault()
	return "woah, are you sure you want to close the game?"
}

world.createEntity(...Archetypes.spectator({
	position: [0, 5, 0],
}))

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

console.log("realm", realm)

