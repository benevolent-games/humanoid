
import {Ecs} from "@benev/toolbox"
import {Op, ob, signals} from "@benev/slate"

import {arch} from "../../ecs/hub.js"
import {Plan} from "../planning/plan.js"
import {HuLevel} from "../../gameplan.js"
import {Bot, Spawner} from "../../ecs/components/plain_components.js"
import {Level, LevelStuff} from "../../ecs/components/hybrids/level.js"

type LevelState = {
	name: HuLevel
	stuff: LevelStuff
	dispose: () => void
}

export class LevelLoader {
	#op = signals.op<LevelState>()
	#count = 0

	get op() {
		return Op.morph(this.#op.value, level => level.name)
	}

	goto: {[K in HuLevel]: () => Promise<LevelState>}

	constructor(
			private world: Ecs.World<any>,
			gameplan: Plan.Game,
		) {

		this.goto = ob(gameplan.levels).map((_, n) =>
			async() => this.#level(n as HuLevel)
		) as any
	}

	async #level(name: HuLevel) {
		if (this.#count > 0 && this.#op.isLoading())
			throw new Error("busy")

		this.#count++
		this.#op.payload?.dispose()

		return this.#op.load(async(): Promise<LevelState> => {
			for (const bot of this.world.query({Bot}).matches)
				bot.dispose()

			const [entity] = this.world.query({Spawner}).matches
			if (entity)
				entity.components.spawner.inputs.switch_to_spectator = true

			const level = this.world.create(
				arch({Level}, {level: {level: name}})
			)

			const stuff = await level.components.level.doneLoading
			return {name, dispose: () => level.dispose(), stuff}
		})
	}
}

