
import {css, html} from "@benev/slate"

import {nexus} from "../../../../../nexus.js"
import {Ui} from "../../../../../models/ui/ui.js"
import {ColorInput, InputGroup} from "./parts/types.js"
import {Game} from "../../../../../models/realm/types.js"
import {renderInputGroup} from "./parts/render-input-group.js"

const particleFogInputs: InputGroup<Ui["particleFog"]> = {
	color1: [ColorInput],
	color2: [ColorInput],
}

export const ParticleFogPanel = nexus.shadow_view(use => (game: Game) => {
	use.name("particle-fog-panel")
	use.styles(css`
		.panel {
			> * + * { margin-top: 1em; }
			> section {
				padding: 1em;
				background: #0002;
				> * + * { display: block; margin-top: 0.6em; }
			}
		}
		h2 { color: white; text-align: center; }
		h3 { color: #89ff91; }
	`)

	const {particleFog} = game.ui

	return html`
		<section class=panel>
			<h2>particleFog</h2>
			${renderInputGroup(particleFog, particleFogInputs)}
		</section>
	`
})

