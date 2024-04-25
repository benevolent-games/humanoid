
import {LocalHandler} from "./local.js"
import {Control} from "../parts/control.js"
import {Scenario} from "../types/exports.js"

export class HostHandler {
	#control: Control

	constructor(control: Control) {
		this.#control = control
		control.tree.transmute(() => ({
			mode: "host",
			lobby: {label: "", players: []},
		}))
	}

	get scenario() {
		return this.#control.get<Scenario.Host>("host")
	}

	async end_session() {
		this.#control.handler = new LocalHandler(this.#control)
	}
}

