
import {css, html} from "@benev/slate"
import {NuiCheckbox, NuiRange} from "@benev/toolbox"
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

		<section>
			<h2>reticule</h2>
			${NuiCheckbox([{
				label: "enabled",
				checked: game.reticuleData.enabled,
				set: c => game.reticuleData.enabled = c,
			}])}
			${NuiRange([{
				label: "size",
				max: 3,
				min: .5,
				step: .1,
				value: game.reticuleData.size,
				set: x => game.reticuleData.size = x,
			}])}
			${NuiRange([{
				label: "opacity",
				max: 1,
				min: .1,
				step: .1,
				value: game.reticuleData.opacity,
				set: x => game.reticuleData.opacity = x,
			}])}
		</section>
	`
})

