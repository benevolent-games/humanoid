
import {Vec2, Vec3, World, vec3} from "@benev/toolbox"

import {Cycle} from "../../tools/cycle.js"
import {Archetypes} from "../../ecs/archetypes/archetypes.js"

export class Respawner {
	constructor(public readonly world: World<any>) {}
	#dispose = () => {}
	#last_gimbal: Vec2 = [0, .5]
	#last_position: Vec3 = [0, 10, 0]
	#current: "humanoid" | "spectator" = "humanoid"

	#cycle = new Cycle<() => () => void>([

		// spectator
		() => {
			this.#current = "spectator"
			const [selector, data] = Archetypes.spectator({
				position: vec3.add(this.#last_position, [0, 1, 0]),
				gimbal: [0, 0.5],
			})
			const entity = this.world.createEntity( selector, {
				...data,
				gimbal: this.#last_gimbal,
			})
			return () => {
				this.#last_gimbal = entity.data.gimbal
				this.#last_position = entity.data.position
				this.world.deleteEntity(entity.id)
			}
		},

		// humanoid
		() => {
			this.#current = "humanoid"
			const gimbal = this.#last_gimbal
			const [selector, data] = Archetypes.humanoid({
				gimbal,
				debug: false,
				position: this.#last_position,
				perspective: "first_person",
			})
			const entity = this.world.createEntity(selector, {
				...data,
				gimbal,
				coolGimbal: {gimbal, records: [gimbal]},
			})
			return () => {
				this.#last_gimbal = entity.data.gimbal
				this.#last_position = entity.data.position
				this.world.deleteEntity(entity.id)
			}
		},
	])

	get current() {
		return this.#current
	}

	respawn() {
		const fn = this.#cycle.next()
		this.#dispose()
		this.#dispose = fn()
	}

	spawnExtraBiped() {
		const [selector, data] = Archetypes.biped({
			gimbal: [0, 0.5],
			debug: true,
			position: this.#last_position,
		})
		const entity = this.world.createEntity(selector, data)
		return entity
	}

	gotoSpectator() {
		if (this.current === "humanoid")
			this.respawn()
	}

	gotoHumanoid() {
		if (this.current === "spectator")
			this.respawn()
	}
}

