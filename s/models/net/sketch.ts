
import {createSessionAsHost, standardRtcConfig, JoinerControls} from "sparrow-rtc"

export type ConnectedClient = {
	inbox: any[]
	outbox: any[]
	controls: JoinerControls
}

export class NetHost {
	static async establish({label}: {label: string}) {
		const netHost = new this()
		const hostConnection = await createSessionAsHost({
			label,
			rtcConfig: standardRtcConfig,
			signalServerUrl: "wss://sparrow-rtc.benevolent.games/",

			onStateChange({session}) {
				console.log("session state changed:", session)
			},

			handleJoin(controls) {
				netHost.clients.set(controls.clientId, {
					inbox: [],
					outbox: [],
					controls,
				})
				console.log(`client has joined: ${controls.clientId}`)

				// send("we can send any string or arraybuffer data!")

				// // we can close the connection whenever we want
				// setTimeout(close, 10_000)

				return {
					handleMessage(message) {
						console.log("message received!", message)
					},
					handleClose() {
						console.log("client connection closed:", controls.clientId)
					},
				}
			},
		})
	}

	clients = new Map<string, ConnectedClient>()
}

// console.log(`now hosting session:`, hostConnection.state.sessionId)

