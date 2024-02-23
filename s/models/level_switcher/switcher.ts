
import {World} from "@benev/toolbox"
import {signals} from "@benev/slate"
import {Cycle} from "../../tools/cycle.js"
import {Loading} from "../../tools/loading.js"
import {Level, LevelName} from "../../ecs/schema/hybrids/level.js"

export class LevelSwitcher {
	#loading = new Loading()
	#dispose: (() => void) | null = null
	current = signals.signal("n/a")

	constructor(public readonly world: World<any>) {}

	next() {
		if (this.#loading.currently)
			return

		if (this.#dispose) {
			this.#dispose()
			this.#dispose = null
		}

		const {name, load} = this.#cycle.next()
		this.current.value = name
		load()
	}

	#level(name: LevelName) {
		return {
			name,
			load: this.#loading.fn(async() => {
				const {world} = this
				const level = world.createEntity({Level}, {level: {name}})
				this.#dispose = () => world.deleteEntity(level.id)
				await level.data.level.doneLoading
			})
		}
	}

	#cycle = new Cycle([
		this.#level("gym"),
		this.#level("mt_pimsley"),
		this.#level("teleporter"),
		this.#level("wrynth_dungeon"),
	] as const)
}

