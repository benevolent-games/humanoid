
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
			<h2>sensitivity</h2>
			${NuiRange([{
				label: "mouse apd (arcseconds-per-dot)",
				max: 5000,
				min: 1,
				step: 1,
				value: game.sensitivity.mouse,
				set: x => game.sensitivity.mouse = x,
			}])}
			${NuiRange([{
				label: "touch apd (arcseconds-per-dot)",
				max: 5000,
				min: 1,
				step: 1,
				value: game.sensitivity.touch,
				set: x => game.sensitivity.touch = x,
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
			<h2>debug</h2>
			${NuiCheckbox([{
				label: "melee tracers",
				checked: game.debug.meleeTracers,
				set: c => game.debug.meleeTracers = c,
			}])}
		</section>

		<section>
			<h2>reticule</h2>
			${NuiCheckbox([{
				label: "enabled",
				checked: game.reticuleState.enabled,
				set: c => game.reticuleState.enabled = c,
			}])}
			${NuiRange([{
				label: "size",
				max: 3,
				min: .5,
				step: .1,
				value: game.reticuleState.size,
				set: x => game.reticuleState.size = x,
			}])}
			${NuiRange([{
				label: "opacity",
				max: 1,
				min: .1,
				step: .1,
				value: game.reticuleState.opacity,
				set: x => game.reticuleState.opacity = x,
			}])}
		</section>
	`
})

