
import {Vec2, Vec3, World, vec3} from "@benev/toolbox"
import {Cycle} from "../../tools/cycle.js"
import {Archetypes} from "../../ecs/archetypes/archetypes.js"

export class Respawner {
	constructor(public readonly world: World<any>) {}
	#dispose = () => {}
	#last_gimbal: Vec2 = [0, .5]
	#last_position: Vec3 = [0, 10, 0]

	#cycle = new Cycle<() => () => void>([

		// humanoid
		() => {
			const [selector, data] = Archetypes.humanoid({
				debug: true,
				position: this.#last_position,
			})
			const entity = this.world.createEntity(
				selector,
				{...data, gimbal: this.#last_gimbal},
			)
			return () => {
				this.#last_gimbal = entity.data.gimbal
				this.#last_position = entity.data.position
				this.world.deleteEntity(entity.id)
			}
		},

		// spectator
		() => {
			const [selector, data] = Archetypes.spectator({
				position: vec3.add(this.#last_position, [0, 1, 0]),
			})
			const entity = this.world.createEntity(
				selector,
				{...data, gimbal: this.#last_gimbal},
			)
			return () => {
				this.#last_gimbal = entity.data.gimbal
				this.#last_position = entity.data.position
				this.world.deleteEntity(entity.id)
			}
		},

	])

	respawn() {
		const fn = this.#cycle.next()
		this.#dispose()
		this.#dispose = fn()
	}
}

