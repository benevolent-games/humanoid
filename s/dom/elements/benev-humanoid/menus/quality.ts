
import {css, html} from "@benev/slate"
import {nexus} from "../../../../nexus.js"
import {HuRealm} from "../../../../models/realm/realm.js"
import {QualityString, quality_from_string} from "../../../../tools/quality.js"

export const QualityMenu = nexus.shadow_view(use => (realm: HuRealm) => {
	use.name("quality-menu")
	use.styles(css`
		:host > * + * { margin-top: 1em; }

		section {
			padding: 1em;
		}

		div {
			display: flex;
			gap: 0.5em;
			justify-content: center;
			flex-wrap: wrap;
		}

		.notice {
			text-align: center;
		}

		button {
			font-size: 1em;
			display: flex;
			flex: 1 1 auto;
			justify-content: center;
			align-items: center;
			padding: 1em;
			background: #ff822775;
			color: white;
			font-weight: bold;
			text-shadow: 1px 2px 2px #0004;
			box-shadow: 1px 2px 3px #0008;
			border: none;
			border-top: 1px solid #fff4;
			border-radius: 0.3em;

			&:hover { background: #ff6b0099; }

			&[disabled] {
				background: #0003;
				box-shadow: inset 1px 2px 20px #0008;
				border: none;
				border-bottom: 1px solid #fff1;
			}

			.emoji { font-size: 1.5em; }
		}
	`)

	function button(emoji: string, label: QualityString, urlquality: string = label) {
		const href = `?quality=${urlquality}`
		const active = realm.gameplan.quality === quality_from_string(label)
		const click = () => window.location.assign(href)
		return html`
			<button
				@click="${click}"
				?disabled="${active}">
				<span class=emoji>${emoji}</span> <span>${label}</span>
			</button>
		`
	}

	return html`
		<section>
			<div>
				${button("🥔", "potato", "bingus")}
				${button("😐", "mid")}
				${button("🧐", "fancy")}
			</div>
			<br/>
			<p class=notice>changing quality mode will restart the game. <em>i'm sorry.</em></p>
		</section>
	`
})

