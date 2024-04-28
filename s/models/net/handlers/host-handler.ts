
import {Op, Trashcan} from "@benev/slate"
import {HostControls, HostState, createSessionAsHost} from "sparrow-rtc"

import {Scenario} from "../types/exports.js"
import {makeHostApi} from "../api/host-api.js"
import {ClientApi} from "../api/client-api.js"
import {Handler, $update, $set} from "./handler.js"
import {PingStation} from "../parts/ping-station.js"
import {sparrowConfig} from "../parts/sparrow-config.js"
import {remoteReceiver, remoteSender} from "../parts/remote.js"

export type HostParams = {
	onSessionDeath: () => void
}

export class HostHandler extends Handler<Scenario.Host> {
	#params: HostParams
	#controls: HostControls | null = null

	constructor(params: HostParams) {
		super()
		this.#params = params
	}

	async initiate(options: {label: string}) {
		try {
			return this.#initiate(options)
		}
		catch (error) {
			this.dispose()
			this.#params.onSessionDeath()
		}
	}

	async dispose() {
		if (this.#controls) {
			this.#controls.close()
			this.#controls = null
		}
	}

	////////////////
	////////////////

	#trash = new Trashcan()
	#clients = new Map<string, {rtt: number}>()
	get #scenario() { return Op.payload(this.scenarioOp)! }

	#addClient(clientId: string) {
		this.#clients.set(clientId, {rtt: -1})
		this.#updateLobbyPlayers()
	}

	#removeClient(clientId: string) {
		this.#clients.delete(clientId)
		this.#updateLobbyPlayers()
	}

	#updateClientRtt(clientId: string, rtt: number) {
		const client = this.#clients.get(clientId)
		if (client)
			client.rtt = rtt
		this.#updateLobbyPlayers()
	}

	#updateLobbyPlayers() {
		this[$update](scenario => {
			scenario.lobby.players = (
				[...this.#clients.entries()]
					.map(([clientId, client]) => ({clientId, ping: client.rtt}))
			)
		})
	}

	#bootUpScenario(state: HostState) {
		const op = this.scenarioOp
		if (!Op.is.ready(op)) {
			this[$set]({
				mode: "host",
				state,
				lobby: {players: []},
			})
		}
	}

	#updateState(state: HostState) {
		this[$update](scenario => { scenario.state = state })
	}

	#handleSessionDied() {
		console.log("host session died")
		this.#controls = null
		this.#clients.clear()
		this.dispose()
		this.#params.onSessionDeath()
	}

	#establishNewClient({clientId, send, close}: {
			clientId: string
			send: (message: string) => void
			close: () => void
		}) {
		const trash = new Trashcan()
		this.#addClient(clientId)

		const pingStation = new PingStation({
			onReport: rtt => this.#updateClientRtt(clientId, rtt),
		})

		const hostApi = makeHostApi({pingStation})
		const clientApi = remoteSender<ClientApi>(send)

		const pingingInterval = setInterval(() => {
			const ping = pingStation.ping()
			clientApi.ping(ping.id, this.#scenario.lobby)
		}, 1000)

		trash.mark(() => clearInterval(pingingInterval))
		trash.mark(() => close())
		trash.mark(() => this.#removeClient(clientId))
		return {hostApi, trash}
	}

	async #initiate({label}: {label: string}) {
		const controls = await createSessionAsHost({
			...sparrowConfig,
			label,
			onConnectionLost: () => {
				this.#handleSessionDied()
			},
			onStateChange: state => {
				this.#updateState(state)
			},
			handleJoin: ({clientId, send, close}) => {
				console.log(`client has joined: ${clientId}`)
				const {hostApi, trash} = (
					this.#establishNewClient({clientId, send, close})
				)
				this.#trash.mark(trash.dispose)
				return {
					handleMessage: remoteReceiver(hostApi),
					handleClose: () => {
						close = () => {}
						trash.dispose()
						console.log("client connection closed:", clientId)
					},
				}
			},
		})
		this.#controls = controls
		this.#bootUpScenario(controls.state)
	}
}

