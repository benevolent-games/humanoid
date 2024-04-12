
import {css, html} from "@benev/slate"
import {Menus} from "@benev/toolbox"

import {Reticle} from "../reticle/view.js"
import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"
import {HealthBar} from "../health-bar/view.js"

export const Overlay = nexus.shadow_view(use => (game: Game, menus: Menus) => {
	use.name("overlay")
	use.styles(css`
		.container {
			pointer-events: none;
			position: absolute;
			z-index: 1;
			inset: 0;

			aspect-ratio: 16 / 9;
			max-height: 100%;
			max-width: 100%;
			width: auto;
			height: 100%;
			margin: auto;

			transition: 200ms linear opacity;
			opacity: 0;
			&[data-open] { opacity: 1; }
		}

		.healthbar {
			position: absolute;
			left: 0;
			right: 0;
			margin: auto;

			width: 50%;
			background: #0002;

			&.target { top: 1em; }
			&.personal { bottom: 1em; }
		}
	`)

	return html`
		<div class="container" ?data-open="${!menus.open.value}">
			${Reticle([game, menus])}

			<div class="target healthbar">
				${HealthBar([game.ui.targetHealth])}
			</div>

			<div class="personal healthbar">
				${HealthBar([game.ui.personalHealth])}
			</div>
		</div>
	`
})

