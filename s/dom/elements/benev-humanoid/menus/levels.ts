
import {op_effect} from "@benev/toolbox"
import {Op, css, html} from "@benev/slate"
import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"
import {HuLevel} from "../../../../gameplan.js"

export const LevelsMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("levels-menu")
	use.styles(css`
		:host > * + * { margin-top: 1em; }
		section { padding: 1em; }
		div {
			display: flex;
			gap: 0.5em;
			justify-content: center;
			flex-wrap: wrap;

			> button {
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
		.loading {
			padding: 1em;
			> [view="loading-indicator"] {
				font-size: 1.5em;
				color: #fff8;
			}
		}
	`)

	const {levelSwitcher} = game

	function button(level: HuLevel) {
		const click = () => levelSwitcher.goto[level]()
		const isLoading = Op.is.loading(levelSwitcher.op)
		const isActive = level === Op.payload(levelSwitcher.op)
		return html`
			<button
				@click="${click}"
				?disabled="${isLoading || isActive}">
				${level}
			</button>
		`
	}

	return html`
		<section>
			<div>
				${button("gym")}
				${button("mt_pimsley")}
				${button("teleporter")}
				${button("wrynth_dungeon")}
			</div>
			<div class=loading>
				${op_effect.binary(levelSwitcher.op, () => {})}
			</div>
		</section>
	`
})

