
import {LocalHandler} from "./local.js"
import {Control} from "../parts/control.js"
import {Scenario} from "../types/exports.js"

export class ClientHandler {
	#control: Control

	constructor(control: Control) {
		this.#control = control
		control.tree.transmute(() => ({
			mode: "client",
			lobby: {label: "", players: []},
		}))
	}

	get scenario() {
		return this.#control.get<Scenario.Client>("client")
	}

	async disconnect() {
		this.#control.handler = new LocalHandler(this.#control)
	}
}

