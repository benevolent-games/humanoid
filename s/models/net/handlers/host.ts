
import {Op, Trashcan, generate_id} from "@benev/slate"
import {HostControls, createSessionAsHost, standardRtcConfig} from "sparrow-rtc"

import {LocalHandler} from "./local.js"
import {Control} from "../parts/control.js"
import {Lobby, Scenario} from "../types/exports.js"

export class HostHandler {
	#control: Control<Scenario.Host>
	#connection: HostControls = undefined as any
	#cleanups = () => {}

	constructor(control: Control<Scenario.Any>) {
		this.#control = control as any
		control.tree.transmute(() => ({
			mode: "host",
			lobbyOp: Op.loading<Lobby>()
		}))
	}

	static async initiate(c: Control<Scenario.Any>) {
		const host = new this(c)
		const control = host.#control
		const trash = new Trashcan()
		const clients = new Map<string, {rtt: number}>()

		function transmuteLobby(fn: (lobby: Lobby) => void) {
			control.update(scenario => {
				if (Op.is.ready(scenario.lobbyOp))
					fn(scenario.lobbyOp.payload)
			})
		}

		function updateLobbyPlayers() {
			transmuteLobby(lobby => {
				lobby.players = (
					[...clients.entries()]
						.map(([id, client]) => ({id, ping: client.rtt}))
				)
			})
		}

		host.#connection = await createSessionAsHost({
			label: "my game session",
			signalServerUrl: "wss://sparrow-rtc.benevolent.games/",
			rtcConfig: standardRtcConfig,

			onStateChange({session}) {
				if (session)
					transmuteLobby(lobby => lobby.session = session)
				else
					host.end_session()
			},

			handleJoin({clientId, send, close}) {
				console.log(`client has joined: ${clientId}`)

				let lastSentPing = {id: generate_id(8), time: Date.now()}
				const client = {rtt: 999}
				clients.set(clientId, client)

				const pingingInterval = setInterval(() => {
					const id = generate_id(8)
					lastSentPing = {id, time: Date.now()}
					send(JSON.stringify({id, kind: "ping"}))
				}, 1000)

				trash.mark(() => clearInterval(pingingInterval))
				trash.mark(close)

				return {
					handleMessage(message) {
						if (typeof message !== "string") throw new Error("invalid message")
						const {id, kind} = JSON.parse(message)
						if (kind !== "pong") throw new Error("invalid message kind from client")
						if (id === lastSentPing.id) {
							client.rtt = Date.now() - lastSentPing.time
							console.log("pong", client.rtt, message)
							updateLobbyPlayers()
						}
					},
					handleClose() {
						clients.delete(clientId)
						clearInterval(pingingInterval)
						updateLobbyPlayers()
						console.log("client connection closed:", clientId)
					},
				}
			},
		})

		host.#cleanups = () => trash.dispose()
		return host
	}

	get scenario() {
		return this.#control.scenario
	}

	async end_session() {
		this.#cleanups()
		this.#connection.close()
		this.#control.handler = new LocalHandler(this.#control as any)
	}
}

