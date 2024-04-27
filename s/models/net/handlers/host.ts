
import {Op, Trashcan} from "@benev/slate"
import {HostControls, Session, createSessionAsHost, standardRtcConfig} from "sparrow-rtc"

import {Handler, $update} from "./handler.js"
import {makeHostApi} from "../api/host-api.js"
import {ClientApi} from "../api/client-api.js"
import {Lobby, Scenario} from "../types/exports.js"
import {PingStation} from "../parts/ping-station.js"
import {remoteReceiver, remoteSender} from "../parts/remote.js"

export type HostParams = {
	onSessionDeath: () => void
}

export class HostHandler extends Handler<Scenario.Host> {
	#params: HostParams
	#connection: HostControls | null = null

	constructor(params: HostParams) {
		super({mode: "host", lobbyOp: Op.loading()})
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
		if (this.#connection) {
			this.#connection.close()
			this.#connection = null
		}
	}

	////////////////
	////////////////

	#trash = new Trashcan()
	#clients = new Map<string, {rtt: number}>()

	#transmuteLobby(fn: (lobby: Lobby) => void) {
		this[$update](scenario => {
			if (Op.is.ready(scenario.lobbyOp))
				fn(scenario.lobbyOp.payload)
		})
	}

	#updateLobbyPlayers() {
		this.#transmuteLobby(lobby => {
			lobby.players = (
				[...this.#clients.entries()]
					.map(([id, client]) => ({id, ping: client.rtt}))
			)
		})
	}

	#updateSession(session: Session) {
		this.#transmuteLobby(lobby => lobby.session = session)
	}

	#handleSessionDied() {
		this.dispose()
		this.#params.onSessionDeath()
	}

	#establishNewClient({clientId, send, close}: {
			clientId: string
			send: (message: string) => void
			close: () => void
		}) {
		const trash = new Trashcan()
		const pingStation = new PingStation({
			onReport: rtt => this.#clients.set(clientId, {rtt}),
		})
		const hostApi = makeHostApi({pingStation})
		const clientApi = remoteSender<ClientApi>(send)

		const pingingInterval = setInterval(() => {
			const ping = pingStation.ping()
			clientApi.ping(ping.id)
		}, 1000)

		trash.mark(() => clearInterval(pingingInterval))
		trash.mark(() => close())
		trash.mark(() => this.#clients.delete(clientId))
		trash.mark(() => this.#updateLobbyPlayers())
		return {hostApi, trash}
	}

	async #initiate({label}: {label: string}) {
		this.#connection = await createSessionAsHost({
			label,
			signalServerUrl: "wss://sparrow-rtc.benevolent.games/",
			rtcConfig: standardRtcConfig,

			onStateChange: ({session}) => {
				if (session) this.#updateSession(session)
				else this.#handleSessionDied()
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
	}
}

