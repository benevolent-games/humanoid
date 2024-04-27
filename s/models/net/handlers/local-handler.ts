
import {$set, Handler} from "./handler.js"
import {Scenario} from "../types/exports.js"

export class LocalHandler extends Handler<Scenario.Local> {

	constructor() {
		super()
		this[$set]({mode: "local"})
	}

	dispose() {}
}

