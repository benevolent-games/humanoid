
import {css, html} from "@benev/slate"
import {Menus} from "@benev/toolbox"

import {Reticle} from "../reticle/view.js"
import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"

export const Overlay = nexus.shadow_view(use => (game: Game, menus: Menus) => {
	use.name("overlay")
	use.styles(css`
		.container {
			pointer-events: none;
			position: absolute;
			z-index: 1;
			inset: 0;
			width: 100%;
			height: 100%;

			transition: 200ms linear opacity;
			opacity: 0;
			&[data-open] { opacity: 1; }
		}
	`)

	return html`
		<div class="container" ?data-open="${!menus.open.value}">
			${Reticle([game, menus])}
		</div>
	`
})


