
import {watch} from "@benev/slate"
import {LocalHandler} from "../handlers/local.js"
import {AnyHandler, Scenario} from "../types/exports.js"

export class Control<S extends Scenario.Any> {
	tree = watch.stateTree<S>({mode: "local"} as any)
	handler: AnyHandler = new LocalHandler(this as any)

	get scenario() {
		return this.tree.state
	}

	update(fn: (scenario: S) => void) {
		this.tree.transmute(scenario => {
			fn(scenario)
			return scenario
		})
	}
}

