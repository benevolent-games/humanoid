
import {Op} from "@benev/slate"
import {JoinerControls, SessionInfo, joinSessionAsClient} from "sparrow-rtc"

import {HostApi} from "../api/host-api.js"
import {$set, $update, Handler} from "./handler.js"
import {Scenario} from "../types/exports.js"
import {makeClientApi} from "../api/client-api.js"
import {sparrowConfig} from "../parts/sparrow-config.js"
import {remoteReceiver, remoteSender} from "../parts/remote.js"

export type ClientParams = {
	onSessionDeath: () => void
}

export class ClientHandler extends Handler<Scenario.Client> {
	#params: ClientParams
	#controls: JoinerControls | null = null

	constructor(params: ClientParams) {
		super()
		this.#params = params
	}

	async initiate(options: {sessionId: string}) {
		try {
			return this.#initiate(options)
		}
		catch (error) {
			this.dispose()
			this.#params.onSessionDeath()
		}
	}

	dispose() {
		if (this.#controls)
			this.#controls.close()
	}

	//////////////////////////////
	//////////////////////////////

	#bootUpScenario({clientId, sessionInfo}: {
			clientId: string
			sessionInfo: SessionInfo
		}) {
		const op = this.scenarioOp
		if (!Op.is.ready(op)) {
			this[$set]({
				mode: "client",
				clientId,
				sessionInfo,
				lobby: {players: []},
			})
		}
	}

	#updateSessionInfo(sessionInfo: SessionInfo) {
		this[$update](scenario => {
			scenario.sessionInfo = sessionInfo
		})
	}

	#handleSessionDied() {
		this.#controls = null
		this.dispose()
		this.#params.onSessionDeath()
	}

	async #initiate({sessionId}: {sessionId: string}) {
		const {controls} = await joinSessionAsClient({
			...sparrowConfig,
			sessionId,
			onStateChange: ({clientId, sessionInfo}) => {
				if (clientId && sessionInfo) {
					this.#bootUpScenario({clientId, sessionInfo})
					this.#updateSessionInfo(sessionInfo)
				}
				else this.#handleSessionDied()
			},
			handleJoin: ({clientId, send}) => {
				this[$update](scenario => {
					scenario.clientId = clientId
				})
				const hostApi = remoteSender<HostApi>(send)
				const clientApi = makeClientApi({hostApi})
				return {
					handleMessage: remoteReceiver(clientApi),
					handleClose: () => this.#handleSessionDied(),
				}
			},
		})
		this.#controls = controls
	}
}

