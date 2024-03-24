
import {css, html} from "@benev/slate"
import {Menus, scalar} from "@benev/toolbox"

import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"
import {icon_tabler_chevron_up} from "../../../../icons/tabler/chevron-up.js"

export const Reticule = nexus.shadow_view(use => (game: Game, menus: Menus) => {
	use.name("reticule")
	use.styles(css`
		.shell {
			position: absolute;
			inset: 0;
			width: 1em;
			height: 1em;

			color: white;
			opacity: 0;
			z-index: 1;
			transition: 200ms linear opacity;

			&[data-active] { opacity: 1; }
			&[data-busy] { color: red; }
		}

		.graphic {
			position: absolute;
			inset: 0;
		}

		:is(.point, svg) {
			display: block;
			position: absolute;
			inset: 0;
			margin: auto;
		}

		.point {
			width: 0.4em;
			height: 0.4em;
			border: 1px solid #000;
			background: currentColor;
			border-radius: 1em;
		}

		.angle > svg {
			display: block;
			width: 0.8em;
			height: 0.8em;
			transform: translate(0, -0.4em);
			filter: drop-shadow(0 0 0.1em black);
		}
	`)

	const {aim, size, enabled, opacity} = game.reticuleState

	const angleStyle = aim.angle === null
		? `opacity: 0;`
		: `transform: rotate(${scalar.radians.to.degrees(aim.angle)}deg);`

	return enabled ? html`
		<div
			class="shell"
			?data-active="${!menus.open.value}"
			?data-busy="${aim.busy}"
			style="font-size: ${size}em;">
			<div class="wrapper" style="opacity: ${opacity};">
				<div class="aim graphic">
					<div class="point"></div>
				</div>
				<div
					class="angle graphic"
					style="${angleStyle}">
					${icon_tabler_chevron_up}
				</div>
			</div>
		</div>
	` : html``
})

