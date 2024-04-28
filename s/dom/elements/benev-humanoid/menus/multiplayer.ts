
import {SessionInfo} from "sparrow-rtc"
import {op_effect} from "@benev/toolbox"
import {Op, css, html} from "@benev/slate"

import {nexus} from "../../../../nexus.js"
import {Game} from "../../../../models/realm/types.js"
import {Lobby} from "../../../../models/net/types/scenario.js"
import {Scenario} from "../../../../models/net/types/exports.js"

export const MultiplayerMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("multiplayer-menu")
	use.styles(css`:host {}`)

	const scenarioOp: Op.For<Scenario.Any> = (
		use.watch(() => game.net.handler.scenarioOp)
	)

	return op_effect.braille(scenarioOp, scenario => {
		function renderSessionInfo(sessionInfo: SessionInfo) {
			const {origin, pathname} = new URL(location.href)
			const sessionLink = origin + pathname + `?quality=potato` + `#session=${sessionInfo.id}`
			return html`
				<p>session id: ${sessionInfo.id}</p>
				<p>session label: ${sessionInfo.label}</p>
				<p>session link: <a href="${sessionLink}">${sessionLink}</a></p>
			`
		}

		function renderLobby(lobby: Lobby) {
			if (lobby.players.length === 0)
				return null
			return html`
				<ol>
					${lobby.players.map(player => html`
						<li>${player.clientId} :: ${player.ping}ms</li>
					`)}
				</ol>
			`
		}

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
					${renderSessionInfo(session)}
					<p>signalServerPing: ${signalServerPing}</p>
					<button @click="${() => game.net.backToLocalSession()}">
						end session
					</button>
					${renderLobby(lobby)}
				`
			}

			case "client": {
				const {lobby} = scenario
				const {sessionInfo} = scenario.state
				return html`
					${renderSessionInfo(sessionInfo)}
					<button @click="${() => game.net.backToLocalSession()}">
						disconnect
					</button>
					${renderLobby(lobby)}
				`
			}
		}})()

		return html`
			<h3>${scenario.mode}</h3>
			${panel}
		`
	})
})

