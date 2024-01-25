
console.log("🤖 humanoid")

import "@babylonjs/loaders/glTF/index.js"
import "@babylonjs/core/Engines/index.js"
import "@babylonjs/core/Culling/ray.js"
import "@babylonjs/core/Animations/index.js"
import "@babylonjs/core/Rendering/edgesRenderer.js"
import "@babylonjs/core/Physics/physicsEngineComponent.js"
import "@babylonjs/core/Rendering/prePassRendererSceneComponent.js"
import "@babylonjs/core/Rendering/geometryBufferRendererSceneComponent.js"

import {register_to_dom} from "@benev/slate"
import {human, measure, quat, scalar, RunningAverage, Ecs4} from "@benev/toolbox"

import {nexus} from "./nexus.js"
import {systems} from "./ecs/systems.js"
import {makeRealm} from "./models/realm/realm.js"
import {Archetypes} from "./ecs/archetypes/archetypes.js"
import {HumanoidSchema, HumanoidTick} from "./ecs/schema.js"
import {BenevHumanoid} from "./dom/elements/benev-humanoid/element.js"
import { hub2 } from "./ecs/hub.js"

register_to_dom({BenevHumanoid})

;(window as any).nexus = nexus

const localTesting = (
	window.location.host.startsWith("localhost") ||
	window.location.host.startsWith("192")
)

const entities = new Ecs4.Entities<HumanoidSchema>()

const realm = await nexus.context.realmOp.load(
	async() => makeRealm({
		entities,
		tickrate: 60,
		glb_links: localTesting ? {
			gym: "/temp/gym14.glb",
			character: "/temp/knightanimations35.glb",
		} : {
			gym: "https://filebin.net/5gtpcvcs5uti6et6/gym14.glb",
			character: "https://filebin.net/zyl9swjbx26uo5ij/knightanimations35.glb",
		},
	})
)

realm.porthole.resolution = localTesting
	? 0.5
	: 1

// const executor = hub.executor(realm, realm.entities, mainpipe)

const executor = hub2.executor(realm, realm.entities, systems)

realm.entities.create({
	environment: "gym",
})

realm.entities.create(Archetypes.hemi({
	direction: [.234, 1, .123],
	intensity: .6,
}))

// realm.entities.create(Archetypes.physicsBox({
// 	density: 1000,
// 	position: [0, 5, 2],
// 	scale: [1, 1, 1],
// 	rotation: quat.identity(),
// }))

// realm.entities.create({
// 	joint: {
// 		anchors: [[0, 0, 0], [2, 0, 0]],
// 		parts: [

// 			realm.entities.create(Archetypes.physicsBox({
// 				density: 1000,
// 				position: [-1, 5, 2],
// 				scale: [1, 1, 1],
// 				rotation: quat.identity(),
// 			})),

// 			realm.entities.create(Archetypes.physicsBox({
// 				density: 1000,
// 				position: [1, 5, 2],
// 				scale: [1, 1, 1],
// 				rotation: quat.identity(),
// 			})),
// 		],
// 	}
// })

{
	realm.impulse.modes.assign("universal", "humanoid")

	let next: () => void = () => {}

	function spectatorState() {
		const id = realm.entities.create(Archetypes.spectator({
			position: [0, 1, -2],
		}))
		next = () => {
			realm.entities.delete(id)
			humanoidState()
		}
	}

	function humanoidState() {
		const id = realm.entities.create({
			...Archetypes.humanoid({
				debug: false,
				position: [0, 5, 0],
			}),
			gimbal: [0.5, 0.5],
		})
		next = () => {
			realm.entities.delete(id)
			spectatorState()
		}
	}

	humanoidState()

	realm.impulse.on.universal.buttons.respawn(input => {
		if (input.down && !input.repeat)
			next()
	})
}

let count = 0
let last_time = performance.now()

const measures = {
	physics: new RunningAverage(),
	tick: new RunningAverage(),
}

function logMeasurements() {
	console.log("\ndiagnostics")
	console.log(`- physics ${human.performance(measures.physics.average)}`)
	console.log(`- tick    ${human.performance(measures.tick.average)}`)
}

realm.stage.remote.onTick(() => {
	const last = last_time

	measures.physics.add(measure(() => {
		realm.physics.step()
	}))

	measures.tick.add(measure(() => {
		const tick: HumanoidTick = {
			tick: count++,
			deltaTime: scalar.clamp(
				((last_time = performance.now()) - last),
				0,
				100, // clamp to 100ms delta to avoid large over-corrections
			) / 1000,
		}
		measures.tick.add(measure(() => {
			executor.execute(tick)
		}))
	}))

	if (count % (realm.tickrate * 5) === 0)
		logMeasurements()
})

realm.stage.remote.start()

console.log("realm", realm)

