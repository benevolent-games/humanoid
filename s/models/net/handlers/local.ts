
import {Handler} from "./handler.js"
import {Scenario} from "../types/exports.js"

export class LocalHandler extends Handler<Scenario.Local> {
	constructor() {
		super({mode: "local"})
	}

	dispose() {}
}

