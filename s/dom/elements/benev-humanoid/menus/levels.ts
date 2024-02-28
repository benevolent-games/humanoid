
import {Op, css, html} from "@benev/slate"
import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"
import {HuLevel} from "../../../../gameplan.js"

export const LevelsMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("levels-menu")
	use.styles(css`
		:host > * + * { margin-top: 1em; }
		section { padding: 1em; }
	`)

	const {levelSwitcher} = game

	function button(level: HuLevel) {
		const click = () => levelSwitcher.goto[level]()
		const isLoading = Op.is.loading(levelSwitcher.op)
		return html`
			<button
				@click="${click}"
				?disabled="${isLoading}">
				${level}
			</button>
		`
	}

	return html`
		<section>
			<h1>level switcher</h1>
			<div>
				${button("gym")}
				${button("mt_pimsley")}
				${button("teleporter")}
				${button("wrynth_dungeon")}
			</div>
		</section>
	`
})

