
import {css, html} from "@benev/slate"
import {NuiCheckbox, NuiRange} from "@benev/toolbox"

import {nexus} from "../../../../nexus.js"
import {Game} from "../../../../models/realm/types.js"

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
				value: game.ui.sensitivity.mouse,
				set: x => game.ui.sensitivity.mouse = x,
			}])}
			${NuiRange([{
				label: "touch apd (arcseconds-per-dot)",
				max: 5000,
				min: 1,
				step: 1,
				value: game.ui.sensitivity.touch,
				set: x => game.ui.sensitivity.touch = x,
			}])}
			${NuiRange([{
				label: "keys (degrees/second)",
				max: 1000,
				min: 1,
				step: 1,
				value: game.ui.sensitivity.keys,
				set: x => game.ui.sensitivity.keys = x,
			}])}
		</section>

		<section>
			<h2>debug</h2>
			${NuiCheckbox([{
				label: "melee tracers",
				checked: game.ui.debug.meleeTracers,
				set: c => game.ui.debug.meleeTracers = c,
			}])}
		</section>

		<section>
			<h2>reticle</h2>
			${NuiCheckbox([{
				label: "enabled",
				checked: game.ui.reticle.enabled,
				set: c => game.ui.reticle.enabled = c,
			}])}
			${NuiRange([{
				label: "size",
				max: 3,
				min: .5,
				step: .1,
				value: game.ui.reticle.size,
				set: x => game.ui.reticle.size = x,
			}])}
			${NuiRange([{
				label: "opacity",
				max: 1,
				min: .1,
				step: .1,
				value: game.ui.reticle.opacity,
				set: x => game.ui.reticle.opacity = x,
			}])}
		</section>
	`
})

