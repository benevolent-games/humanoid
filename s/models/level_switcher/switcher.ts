
import {World} from "@benev/toolbox"
import {Op, ob, signals} from "@benev/slate"

import {Plan} from "../planning/plan.js"
import {HuLevel} from "../../gameplan.js"
import {Cycle} from "../../tools/cycle.js"
import {Respawner} from "../respawner/respawner.js"
import {Level} from "../../ecs/schema/hybrids/level.js"

type LevelState = {
	name: HuLevel
	dispose: () => void
}

export class LevelSwitcher {
	#op = signals.op<LevelState>()
	#cycle: Cycle<() => Promise<LevelState>>
	#enforce_busy = false

	get op() {
		return Op.morph(this.#op.value, level => level.name)
	}

	goto: {[K in HuLevel]: () => Promise<void>}

	constructor(
			public readonly world: World<any>,
			public readonly gameplan: Plan.Game,
			public readonly respawner: Respawner,
		) {

		this.#cycle = new Cycle(
			gameplan.levelCycle.map(n => () => this.#level(n as HuLevel))
		)

		this.goto = ob(gameplan.levels).map((_, n) =>
			async() => { await this.#level(n as HuLevel) }
		) as any

		this.next().then(() => respawner.gotoHumanoid())
		this.#enforce_busy = true
	}

	async next() {
		const fn = this.#cycle.next()
		await fn()
	}

	async #level(name: HuLevel) {
		if (this.#enforce_busy && this.#op.isLoading())
			throw new Error("busy")
		this.respawner.gotoSpectator()
		this.#op.payload?.dispose()
		return this.#op.load(async() => {
			const {world} = this
			const level = world.createEntity({Level}, {level: {level: name}})
			const dispose = () => world.deleteEntity(level.id)
			await level.data.level.doneLoading
			return {name, dispose}
		})
	}
}

