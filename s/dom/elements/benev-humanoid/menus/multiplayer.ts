
import {css, html} from "@benev/slate"
import {nexus} from "../../../../nexus.js"
import {Game} from "../../../../models/realm/types.js"

export const MultiplayerMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("multiplayer-menu")
	use.styles(css`:host {}`)

	const scenario = use.watch(() => game.net.handler.scenario)

	const panel = (() => {switch (scenario.mode) {
		case "local": {
			return html`
				<button @click="${() => game.net.startHostSession()}">
					host a new session!
				</button>
				<button @click="${() => game.net.joinAsClient()}">
					connect as client
				</button>
			`
		}
		case "host": {
			return html`
				<button @click="${() => game.net.backToLocalSession()}">
					end session
				</button>
			`
		}
		case "client": {
			return html`
				<button @click="${() => game.net.backToLocalSession()}">
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

