
console.log("🤖 humanoid")

import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Physics/physicsEngineComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {scalar} from "@benev/toolbox"
import {register_to_dom} from "@benev/slate"

import {nexus} from "./nexus.js"
import {root} from "./ecs/logic/root.js"
import {HumanoidTick, hub} from "./ecs/hub.js"
import {Sky} from "./ecs/schema/hybrids/sky.js"
import {makeRealm} from "./models/realm/realm.js"
import {Archetypes} from "./ecs/archetypes/archetypes.js"
import {Environment} from "./ecs/schema/hybrids/environment.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const localTesting = (
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192")
) && !window.location.search.includes("cloud")

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		tickrate: 60,
		...(localTesting ? {
			glb_links: {
				gym: "/temp/gym14.glb",
				character: "/temp/knightanimations43lowpoly.glb",
			},
			skybox_links: {
				px: "/temp/sky_01/px.webp",
				py: "/temp/sky_01/py.webp",
				pz: "/temp/sky_01/nz.webp",
				nx: "/temp/sky_01/nx.webp",
				ny: "/temp/sky_01/ny.webp",
				nz: "/temp/sky_01/pz.webp",
			},
		}
		: {
			glb_links: {
				gym: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/gym14.glb",
				character: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/knightanimations43lowpoly.glb",
			},
			skybox_links: {
				px: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/px.webp",
				py: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/py.webp",
				pz: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/nz.webp", // note the remapping
				nx: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/nx.webp",
				ny: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/ny.webp",
				nz: "https://benev-storage.sfo2.cdn.digitaloceanspaces.com/sky_01/pz.webp", // note the remapping
			},
		})
	})
)

realm.porthole.resolution = localTesting
	? 0.5
	: 1

const world = hub.world(realm)
const executive = hub.executive(realm, world, root)

world.create({Environment}, {
	environment: {asset: "gym"},
})

world.create({Sky}, {
	sky: {size: 1_000, rotation: 180},
})

world.create(...Archetypes.spectator({
	position: [0, 5, 0],
}))

let count = 0
let gametime = 0
let last_time = performance.now()

realm.stage.remote.onTick(() => {
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

realm.stage.remote.start()

console.log("realm", realm)






// const executor = hub.executor(realm, realm.entities, systems)

// realm.entities.create({
// 	environment: "gym",
// })

// realm.entities.create({
// 	sky: {
// 		size: 1_000,
// 		rotation: 180,
// 	},
// })

// realm.entities.create(Archetypes.hemi({
// 	direction: [.234, 1, .123],
// 	intensity: .6,
// }))

// function* setup_bot_spawnpoints() {
// 	while (true) {
// 		for (const [x, z] of loop2d([3, 3]))
// 			yield [x, 5, z + 3] as Vec3
// 	}
// }

// const bots: Ecs4.Id[] = []
// const bot_spawnpoints = setup_bot_spawnpoints()

// function spawn_a_bot() {
// 	const position = bot_spawnpoints.next().value!
// 	const id = realm.entities.create({
// 		...Archetypes.bot({debug: false, position}),
// 		...Archetypes.aiBrain(),
// 		gimbal: [0.5, 0.5],
// 	})
// 	bots.push(id)
// }

// realm.impulse.on.universal.buttons.bot_spawn(input => {
// 	if (input.down)
// 		spawn_a_bot()
// })

// realm.impulse.on.universal.buttons.bot_delete(input => {
// 	if (input.down) {
// 		const id = bots.shift()
// 		if (id)
// 			realm.entities.delete(id)
// 	}
// })

// {
// 	realm.impulse.modes.assign("universal", "humanoid")

// 	let next: () => void = () => {}

// 	function spectatorState() {
// 		const id = realm.entities.create(Archetypes.spectator({
// 			position: [0, 1, -2],
// 		}))
// 		next = () => {
// 			realm.entities.delete(id)
// 			humanoidState()
// 		}
// 	}

// 	function humanoidState() {
// 		const id = realm.entities.create({
// 			...Archetypes.humanoid({
// 				debug: false,
// 				position: [0, 5, 0],
// 			}),
// 			gimbal: [0, 0.5],
// 		})
// 		next = () => {
// 			realm.entities.delete(id)
// 			spectatorState()
// 		}
// 	}

// 	humanoidState()
// 	spawn_a_bot()

// 	realm.impulse.on.universal.buttons.respawn(input => {
// 		if (input.down && !input.repeat)
// 			next()
// 	})
// }

// let count = 0
// let gametime = 0
// let last_time = performance.now()

// const measures = {
// 	tick: new RunningAverage(),
// 	physics: new RunningAverage(),
// 	logic: new RunningAverage(),
// }

// function logMeasurements() {
// 	console.log([
// 		`== diagnostics ==`,
// 		`     tick ${human.performance(measures.tick.average)}`,
// 		`  physics ${human.performance(measures.physics.average)}`,
// 		`    logic ${human.performance(measures.logic.average)}`,
// 	].join("\n"))
// }

// realm.stage.remote.onTick(() => {
// 	const last = last_time

// 	measures.tick.add(measure(() => {
// 		measures.physics.add(measure(() => {
// 			realm.physics.step()
// 		}))

// 		measures.logic.add(measure(() => {
// 			const seconds = scalar.clamp(
// 				((last_time = performance.now()) - last),
// 				0,
// 				1000 / 30, // clamp delta to avoid large over-corrections
// 			) / 1000

// 			gametime += seconds

// 			const tick: HumanoidTick = {
// 				seconds,
// 				gametime,
// 				count: count++,
// 				hz: 1 / seconds,
// 			}

// 			executor.execute(tick)
// 		}))
// 	}))

// 	if (count % (realm.tickrate * 5) === 0)
// 		logMeasurements()
// })

// realm.stage.remote.start()

// console.log("realm", realm)

