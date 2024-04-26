
import {HostHandler} from "./host.js"
import {ClientHandler} from "./client.js"
import {Control} from "../parts/control.js"
import {Scenario} from "../types/exports.js"

export class LocalHandler {
	#control: Control<Scenario.Local>

	constructor(control: Control<Scenario.Any>) {
		this.#control = control as any
		control.tree.transmute(() => ({mode: "local"}))
	}

	get scenario() {
		return this.#control.scenario
	}

	async start_host_session() {
		this.#control.handler = await HostHandler.initiate(this.#control as any)
	}

	async connect_as_client() {
		this.#control.handler = await ClientHandler.initiate(this.#control as any)
	}
}

