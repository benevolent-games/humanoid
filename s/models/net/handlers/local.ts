
import {HostHandler} from "./host.js"
import {ClientHandler} from "./client.js"
import {Control} from "../parts/control.js"
import {Scenario} from "../types/exports.js"

export class LocalHandler {
	#control: Control

	constructor(control: Control) {
		this.#control = control
		control.tree.transmute(() => ({mode: "local"}))
	}

	get scenario() {
		return this.#control.get<Scenario.Local>("local")
	}

	async start_host_session() {
		this.#control.handler = new HostHandler(this.#control)
	}

	async connect_as_client() {
		this.#control.handler = new ClientHandler(this.#control)
	}
}

