
import {HostHandler} from "./handlers/host.js"
import {LocalHandler} from "./handlers/local.js"
import {ClientHandler} from "./handlers/client.js"

export type AnyHandler = HostHandler | ClientHandler | LocalHandler

export class Net {
	handler: AnyHandler

	constructor() {
		this.handler = new LocalHandler()
	}

	async startHostSession() {
		this.handler.dispose()
		this.handler = new HostHandler({
			onSessionDeath: () => this.backToLocalSession(),
		})
		await this.handler.initiate()
	}

	async joinAsClient() {
		this.handler.dispose()
	}

	async backToLocalSession() {
		this.handler.dispose()
	}
}

