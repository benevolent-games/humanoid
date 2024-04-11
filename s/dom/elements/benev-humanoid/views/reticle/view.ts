
import {css, html, is} from "@benev/slate"
import {Menus, scalar} from "@benev/toolbox"

import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"
import {Melee} from "../../../../../models/attacking/melee.js"
import {icon_tabler_chevron_up} from "../../../../icons/tabler/chevron-up.js"

export const Reticle = nexus.shadow_view(use => (game: Game, menus: Menus) => {
	use.name("reticle")
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

			&[data-mode="attack"] { color: #a00; }
			&[data-mode="attack-release"] { color: #f00; }

			&[data-mode="parry"] { color: #088; }
			&[data-mode="parry-protective"] { color: #0ff; }
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

	const {enabled, size, opacity, data} = game.ui.reticle

	const aim = data?.meleeAim
	const action = data?.meleeAction

	const angle = (Melee.is.stab(action) || Melee.is.parry(action))
		? null
		: Melee.is.swing(action)
			? action?.angle
			: aim?.angle

	const mode = (
		Melee.is.attack(action)
			? action.report.phase === "release"
				? "attack-release"
				: "attack"
			: Melee.is.parry(action)
				? action.protective
					? "parry-protective"
					: "parry"
				: "plain"
	)

	const angleStyle = is.defined(angle)
		? `transform: rotate(${scalar.radians.to.degrees(angle)}deg);`
		: `opacity: 0;`

	return enabled ? html`
		<div
			class="shell"
			?data-active="${!menus.open.value}"
			data-mode="${mode}"
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

