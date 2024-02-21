
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

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const localTesting = (
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192")
) && !window.location.search.includes("cloud")

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		tickrate_hz: 60,
		links: localTesting

			//
			// LOCAL TESTING TEMP LINKS
			//
			? {
				assets: {
					gym: "/glbs/gym15.2.glb",
					character: "/glbs/knightanimations43lowpoly.2.glb",
					wrynth_dungeon: "/glbs/the_grand_opening37.2.glb",
				},
				envmap: "/temp/wrynthinteriors2.env",
				skybox: {
					px: "/temp/sky_01/px.webp",
					py: "/temp/sky_01/py.webp",
					pz: "/temp/sky_01/nz.webp",
					nx: "/temp/sky_01/nx.webp",
					ny: "/temp/sky_01/ny.webp",
					nz: "/temp/sky_01/pz.webp",
				},
			}

			//
			// PRODUCTION CDN LINKS
			//
			: {
				assets: {
					gym: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/glbs/gym15.0.glb",
					character: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/glbs/knightanimations43lowpoly.0.glb",
					wrynth_dungeon: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/glbs/the_grand_opening37.0.glb",
				},
				envmap: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/wrynthinteriors2.env",
				skybox: {
					px: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/px.webp",
					py: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/py.webp",
					pz: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/nz.webp", // note the remapping
					nx: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/nx.webp",
					ny: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/ny.webp",
					nz: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/pz.webp", // note the remapping
				},
			}
	})
)

realm.stage.porthole.resolution = localTesting
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

