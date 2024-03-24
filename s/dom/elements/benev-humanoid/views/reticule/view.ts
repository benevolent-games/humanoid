
import {Menus} from "@benev/toolbox"
import {css, html} from "@benev/slate"
import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"

export const Reticule = nexus.shadow_view(use => (game: Game, menus: Menus) => {
	use.name("reticule")
	use.styles(css`
		.shell {
			position: absolute;
			inset: 0;
			width: 1em;
			height: 1em;

			opacity: 0;
			z-index: 1;
			transition: 200ms linear opacity;

			&[data-active] {
				opacity: 1;
			}

		}

		.point {
			position: absolute;
			inset: 0;
			margin: auto;

			width: 0.3em;
			height: 0.3em;
			border: 1px solid #0004;
			background: #fff8;
			border-radius: 1em;
		}
	`)

	const degrees = game.reticuleData.aim_direction.value
	const transform = `transform: rotate(${degrees}deg) translate(0, -0.5em);`

	return html`
		<div class=shell ?data-active="${!menus.open.value}">
			<div class="mid point"></div>
			<div class="far point" style="${transform}"></div>
		</div>
	`
})

