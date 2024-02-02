
import {Ecs4, Meshoid, Physics, Porthole, Prop, Rapier, Stage, debug_colors} from "@benev/toolbox"

import {Spawn} from "./parts/spawn.js"
import {RefStore} from "./parts/ref_store.js"
import {HumanoidSchema} from "../../ecs/schema.js"
import {HumanoidImpulse} from "../impulse/impulse.js"
import {SkyboxLinks} from "../../tools/make_skybox.js"
import {CharacterContainer} from "../character/container.js"

export type Realm = {
	tickrate: number
	porthole: Porthole
	stage: Stage
	colors: ReturnType<typeof debug_colors>
	impulse: HumanoidImpulse
	physics: Physics
	entities: Ecs4.Entities<HumanoidSchema>
	spawn: Spawn
	skybox_links: SkyboxLinks
	stores: {
		meshes: RefStore<Meshoid>
		props: RefStore<Prop>
		physics_rigids: RefStore<Rapier.RigidBody>
	}
}

export async function makeRealm({
		entities, tickrate, glb_links, skybox_links,
	}: {
		entities: Ecs4.Entities<HumanoidSchema>
		tickrate: number
		skybox_links: SkyboxLinks
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

	return {
		tickrate,
		porthole,
		stage,
		colors,
		impulse,
		physics,
		entities,
		skybox_links,
		spawn: new Spawn({gym, character}),
		stores: {
			props: new RefStore<Prop>("props"),
			meshes: new RefStore<Meshoid>("meshes"),
			physics_rigids: new RefStore<Rapier.RigidBody>("physics_rigids"),
		},
	}
}

