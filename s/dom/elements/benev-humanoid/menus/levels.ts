
import {op_effect} from "@benev/toolbox"
import {Op, css, html} from "@benev/slate"
import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"
import {HuLevel} from "../../../../gameplan.js"
import {QualityString, quality_from_string} from "../../../../tools/quality.js"

export const LevelsMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("levels-menu")
	use.styles(css`
		:host > * + * { margin-top: 1em; }

		section {
			padding: 1em;
			text-align: center;
			> div {
				display: flex;
				gap: 0.5em;
				justify-content: center;
				flex-wrap: wrap;
			}
			> * + * {
				margin-top: 1em;
			}
		}

		.loading {
			padding: 1em;
			> [view="loading-indicator"] {
				font-size: 1.5em;
				color: #fff8;
			}
		}

		section.levels {
			& button {
				flex: 1 1 auto;
				max-width: 12em;
				padding: 1em;
				color: #fff;
				background: #585d;
				text-shadow: 1px 2px 2px #0004;
				border: none;
				border-radius: 0.3em;

				&[disabled] {
					color: #fff6;
					background: #4862;
					box-shadow: inset 1px 2px 20px #0008;
				}
			}
		}

		section.quality {
			& button {
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
		}
	`)

	function levelButton(level: HuLevel) {
		const click = () => {
			game.levelLoader.goto[level]()
		}
		const isLoading = Op.is.loading(game.levelLoader.op)
		const isActive = level === Op.payload(game.levelLoader.op)
		return html`
			<button
				@click="${click}"
				?disabled="${isLoading || isActive}">
				${level}
			</button>
		`
	}

	function qualityButton(emoji: string, label: QualityString, urlquality: string = label) {
		const href = `?quality=${urlquality}`
		const active = game.gameplan.quality === quality_from_string(label)
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
		<section class=quality>
			<h2>change quality mode</h2>
			<p class=notice>changing quality mode will restart the game. <em>i'm sorry.</em></p>
			<div>
				${qualityButton("🥔", "potato", "bingus")}
				${qualityButton("😐", "mid")}
				${qualityButton("🧐", "fancy")}
			</div>
			<br/>
		</section>

		<section class=levels>
			<h2>switch levels</h2>
			<div>
				${Object.keys(game.gameplan.levels).map(level =>
					levelButton(level as HuLevel)
				)}
			</div>
			<div class=loading>
				${op_effect.binary(game.levelLoader.op, () => {})}
			</div>
		</section>
	`
})

