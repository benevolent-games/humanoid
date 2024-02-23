
import {World} from "@benev/toolbox"
import {signals} from "@benev/slate"
import {Cycle} from "../../tools/cycle.js"
import {Loading} from "../../tools/loading.js"
import {HuLevelName} from "../../asset_links.js"
import {Level} from "../../ecs/schema/hybrids/level.js"

type LevelLoader = {
	name: HuLevelName
	load: () => Promise<void>
}

export class LevelSwitcher {
	#loading = new Loading()
	#dispose: (() => void) | null = null
	#cycle: Cycle<LevelLoader[]>

	current = signals.signal("n/a")

	constructor(
			public readonly world: World<any>,
			public readonly levels: HuLevelName[],
		) {
		this.#cycle = new Cycle(levels.map(n => this.#level(n)))
	}

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

	#level(name: HuLevelName) {
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
}

