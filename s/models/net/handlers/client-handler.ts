
import {Op} from "@benev/slate"
import {ClientState, joinSessionAsClient} from "sparrow-rtc"

import {HostApi} from "../api/host-api.js"
import {Scenario} from "../types/exports.js"
import {makeClientApi} from "../api/client-api.js"
import {$set, $update, Handler} from "./handler.js"
import {sparrowConfig} from "../parts/sparrow-config.js"
import {remoteReceiver, remoteSender} from "../parts/remote.js"
import { Lobby } from "../types/scenario.js"

export type ClientParams = {
	onSessionDeath: () => void
}

export class ClientHandler extends Handler<Scenario.Client> {
	#params: ClientParams
	#connection: Awaited<ReturnType<typeof joinSessionAsClient>> | null = null

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
		if (this.#connection)
			this.#connection.close()
	}

	//////////////////////////////
	//////////////////////////////

	#bootUpScenario(state: ClientState) {
		const op = this.scenarioOp
		if (!Op.is.ready(op)) {
			this[$set]({
				mode: "client",
				state,
				lobby: {players: []},
			})
		}
	}

	#updateState(state: ClientState) {
		this[$update](scenario => { scenario.state = state })
	}

	#updateLobby(lobby: Lobby) {
		this[$update](scenario => { scenario.lobby = lobby })
	}

	#handleSessionDied() {
		console.log("client session died!")
		this.#connection = null
		this.dispose()
		this.#params.onSessionDeath()
	}

	async #initiate({sessionId}: {sessionId: string}) {
		const connection = await joinSessionAsClient({
			...sparrowConfig,
			sessionId,
			onClosed: () => {
				this.#handleSessionDied()
			},
			onStateChange: state => {
				this.#updateState(state)
			},
			handleJoin: ({send}) => {
				const hostApi = remoteSender<HostApi>(send)
				const clientApi = makeClientApi({
					hostApi,
					updateLobby: lobby => this.#updateLobby(lobby),
				})
				return {
					handleMessage: remoteReceiver(clientApi),
					handleClose: () => this.#handleSessionDied(),
				}
			},
		})
		this.#connection = connection
		this.#bootUpScenario(connection.state)
	}
}

