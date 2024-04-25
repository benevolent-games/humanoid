
import {watch} from "@benev/slate"
import {LocalHandler} from "../handlers/local.js"
import {AnyHandler, Scenario} from "../types/exports.js"

export class Control {
	tree = watch.stateTree<Scenario.Any>({mode: "local"})
	handler: AnyHandler = new LocalHandler(this as any)
	get<S extends Scenario.Any>(mode: S["mode"]): S {
		const scenario = this.tree.state
		if (scenario.mode === mode) return scenario as S
		else throw new Error(`wrong mode "${scenario.mode}" where "${mode} was expected."`)
	}
}

