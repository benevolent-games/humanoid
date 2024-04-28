
import {HostHandler} from "./handlers/host-handler.js"
import {LocalHandler} from "./handlers/local-handler.js"
import {ClientHandler} from "./handlers/client-handler.js"

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
		await this.handler.initiate({label: "testing session"})
	}

	async joinAsClient(sessionId: string) {
		this.handler.dispose()
		this.handler = new ClientHandler({
			onSessionDeath: () => this.backToLocalSession(),
		})
		await this.handler.initiate({sessionId})
	}

	async backToLocalSession() {
		this.handler.dispose()
		this.handler = new LocalHandler()
	}
}

