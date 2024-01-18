
import {Ecs, Physics, Porthole, Stage, debug_colors} from "@benev/toolbox"

import {spawners} from "../../ecs/spawners.js"
import {MeshStore} from "./parts/mesh_store.js"
import {HumanoidSchema} from "../../ecs/schema.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {CharacterContainer} from "../character/container.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"

export type HumanoidContainers = {
	gym: AssetContainer
	character: CharacterContainer
}

export type Realm = {
	tickrate: number
	porthole: Porthole
	stage: Stage
	colors: ReturnType<typeof debug_colors>
	impulse: HumanoidImpulse
	physics: Physics
	entities: Ecs.Entities<HumanoidSchema>
	spawn: ReturnType<typeof spawners>
	meshStore: MeshStore
	containers: HumanoidContainers
}

export async function makeRealm({entities, tickrate, glb_links}: {
		entities: Ecs.Entities<HumanoidSchema>
		tickrate: number
		glb_links: {
			gym: string
			character: string
		}
	}): Promise<Realm> {

	const impulse = new HumanoidImpulse()
	const porthole = new Porthole()

	const stage = new Stage({
		canvas: porthole.canvas,
		background: Stage.backgrounds.sky(),
		tickrate,
	})

	const colors = debug_colors(stage.scene)

	const physics = new Physics({
		hz: 60,
		colors,
		scene: stage.scene,
		gravity: [0, -9.81, 0],
	})

	const [gym, character] = await Promise.all([
		stage.load_glb(glb_links.gym),
		stage.load_glb(glb_links.character)
			.then(container => new CharacterContainer(container)),
	])

	for (const light of gym.lights)
		light.intensity /= 1000

	return {
		tickrate,
		porthole,
		stage,
		colors,
		impulse,
		physics,
		entities,
		spawn: spawners(entities),
		meshStore: new MeshStore(),
		containers: {gym, character},
	}
}

