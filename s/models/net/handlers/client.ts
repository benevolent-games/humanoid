
import {Op} from "@benev/slate"
import {LocalHandler} from "./local.js"
import {Control} from "../parts/control.js"
import {Lobby, Scenario} from "../types/exports.js"

export class ClientHandler {
	#control: Control<Scenario.Client>

	constructor(control: Control<Scenario.Any>) {
		this.#control = control as any
		this.#control.tree.transmute(() => ({
			mode: "client",
			lobbyOp: Op.loading<Lobby>()
		}))
	}

	static async initiate(c: Control<Scenario.Any>) {
		return new this(c)
	}

	get scenario() {
		return this.#control.scenario
	}

	async disconnect() {
		this.#control.handler = new LocalHandler(this.#control as any)
	}
}

