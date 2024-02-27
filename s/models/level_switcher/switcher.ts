
import {World} from "@benev/toolbox"
import {signals} from "@benev/slate"
import {Plan} from "../planning/plan.js"
import {HuLevel} from "../../gameplan.js"
import {Cycle} from "../../tools/cycle.js"
import {Loading} from "../../tools/loading.js"
import {Level} from "../../ecs/schema/hybrids/level.js"

type LevelLoader = {
	name: HuLevel
	load: () => Promise<void>
}

export class LevelSwitcher {
	#loading = new Loading()
	#dispose: (() => void) | null = null
	#cycle: Cycle<LevelLoader>

	current = signals.signal("n/a")

	constructor(
			public readonly world: World<any>,
			public readonly gameplan: Plan.Game,
		) {
		this.#cycle = new Cycle(this.gameplan.levelCycle.map(n => this.#level(n as HuLevel)))
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

	#level(name: HuLevel) {
		return {
			name,
			load: this.#loading.fn(async() => {
				const {world} = this
				const level = world.createEntity({Level}, {level: {level: name}})
				this.#dispose = () => world.deleteEntity(level.id)
				await level.data.level.doneLoading
			})
		}
	}
}

