
import {World} from "@benev/toolbox"
import {Cycle} from "../../tools/cycle.js"
import {Archetypes} from "../../ecs/archetypes/archetypes.js"

export class Respawner {
	constructor(public readonly world: World<any>) {}

	#dispose = () => {}

	#cycle = new Cycle<() => () => void>([

		// spectator
		() => {
			const {id} = this.world.createEntity(
				...Archetypes.spectator({
					position: [0, 10, 0],
				})
			)
			return () => this.world.deleteEntity(id)
		},

		// nada
		() => {
			return () => {}
		},
	])

	respawn() {
		const fn = this.#cycle.next()
		this.#dispose()
		this.#dispose = fn()
	}
}

