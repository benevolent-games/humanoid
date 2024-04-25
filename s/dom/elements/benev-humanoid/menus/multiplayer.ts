
import {css, html} from "@benev/slate"
import {nexus} from "../../../../nexus.js"
import {Game} from "../../../../models/realm/types.js"
import {HostHandler} from "../../../../models/net/handlers/host.js"
import {LocalHandler} from "../../../../models/net/handlers/local.js"
import {ClientHandler} from "../../../../models/net/handlers/client.js"

export const MultiplayerMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("multiplayer-menu")
	use.styles(css`:host {}`)

	const scenario = use.watch(() => game.net.handler.scenario)

	const panel = (() => {switch (scenario.mode) {
		case "local": {
			const handler = game.net.handler as LocalHandler
			return html`
				<button @click="${() => handler.start_host_session()}">
					host a new session!
				</button>
				<button @click="${() => handler.connect_as_client()}">
					connect as client
				</button>
			`
		}
		case "host": {
			const handler = game.net.handler as HostHandler
			return html`
				<button @click="${() => handler.end_session()}">
					end session
				</button>
			`
		}
		case "client": {
			const handler = game.net.handler as ClientHandler
			return html`
				<button @click="${() => handler.disconnect()}">
					disconnect
				</button>
			`
		}
	}})()

	return html`
		<h3>${scenario.mode}</h3>
		${panel}
	`
})

