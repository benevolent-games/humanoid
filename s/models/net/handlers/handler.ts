
import {Scenario} from "../types/exports.js"
import {Op, StateTree, watch} from "@benev/slate"

export const $set = Symbol()
export const $update = Symbol()

export abstract class Handler<S extends Scenario.Any> {
	#tree: StateTree<Op.For<S>>

	constructor() {
		this.#tree = watch.stateTree(Op.loading())
	}

	get scenarioOp() {
		return this.#tree.state
	}

	;[$set](scenario: S) {
		this.#tree.transmute(() => Op.ready(scenario))
	}

	;[$update](fn: (scenario: S) => void) {
		this.#tree.transmute(op => {
			if (Op.is.ready(op)) fn(op.payload)
			// else throw new Error("scenario not in ready state")
			return op
		})
	}

	abstract dispose(): void
}

