
import {Scenario} from "../types/exports.js"
import {StateTree, watch} from "@benev/slate"

export const $update = Symbol()

export abstract class Handler<S extends Scenario.Any> {
	#tree: StateTree<S>

	constructor(scenario: S) {
		this.#tree = watch.stateTree(scenario)
	}

	get scenario() {
		return this.#tree.state
	}

	;[$update](fn: (scenario: S) => void) {
		this.#tree.transmute(scenario => {
			fn(scenario)
			return scenario
		})
	}

	abstract dispose(): void
}

