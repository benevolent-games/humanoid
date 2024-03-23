
import {css, html} from "@benev/slate"
import {NuiRange} from "@benev/toolbox"
import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"

export const ConfigMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("config-menu")
	use.styles(css`
		:host > * + * { margin-top: 1em; }
		section {
			padding: 1em;
			> div {
				display: flex;
				gap: 0.5em;
				justify-content: center;
				flex-wrap: wrap;
			}
		}
	`)

	return html`
		<section>
			<h2>sensitivities</h2>
			${NuiRange([{
				label: "mouse (arcseconds/count)",
				max: 1000,
				min: 1,
				step: 1,
				value: game.sensitivity.mouse,
				set: x => game.sensitivity.mouse = x,
			}])}
			${NuiRange([{
				label: "keys (degrees/second)",
				max: 1000,
				min: 1,
				step: 1,
				value: game.sensitivity.keys,
				set: x => game.sensitivity.keys = x,
			}])}
		</section>
	`
})

