
import {op_effect} from "@benev/toolbox"
import {Op, css, html} from "@benev/slate"
import {nexus} from "../../../../nexus.js"
import {Game} from "../../../../models/realm/types.js"
import {Scenario} from "../../../../models/net/types/exports.js"

export const MultiplayerMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("multiplayer-menu")
	use.styles(css`:host {}`)

	const scenarioOp: Op.For<Scenario.Any> = (
		use.watch(() => game.net.handler.scenarioOp)
	)

	return op_effect.braille(scenarioOp, scenario => {
		const panel = (() => {switch (scenario.mode) {
			case "local": {
				return html`
					<button @click="${() => game.net.startHostSession()}">
						host a new session!
					</button>
					<button @click="${() => game.net.joinAsClient("")}">
						connect as client
					</button>
				`
			}
			case "host": {
				const {lobby} = scenario
				const {session, signalServerPing} = scenario.state
				return html`
					<p>session id: ${session.id}</p>
					<p>session label: ${session.label}</p>
					<p>signalServerPing: ${signalServerPing}</p>
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
})

