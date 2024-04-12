
import {scalar} from "@benev/toolbox"
import {css, html} from "@benev/slate"

import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"

export const HealthBar = nexus.shadow_view(use => (game: Game) => {
	use.name("health")
	use.styles(css`
		.plate {
			position: absolute;
			bottom: 1em;
			left: 0;
			right: 0;
			margin: auto;

			width: 50%;
			background: #0002;

			display: flex;
			gap: 0.4em;
			padding: 0.4em;
			border-radius: 0.2em;

			&[hidden] {
				display: none;
			}
		}

		.bar {
			display: flex;
			flex: 1 0 0;
			height: 0.8em;

			> * {
				flex: 0 0 auto;
				height: 100%;
			}

		}
		.stamina {
			justify-content: end;
			background: #220a;
			.juice { background: #ff0; }
		}

		.health {
			justify-content: start;
			background: #200a;
			.hp { background: #f00; }
			.bleed { background: #a05; }
		}
	`)

	const {enabled, hp, bleed, stamina} = game.ui.personalHealth

	const bleedpoint = scalar.clamp(hp - bleed)
	const hpWidth = (bleedpoint) * 100
	const bleedWidth = (hp - bleedpoint) * 100

	return html`
		<div class=plate ?hidden="${!enabled}">
			<div class="stamina bar">
				<div class=juice style="width: ${stamina * 100}%;"></div>
			</div>
			<div class="health bar">
				<div class=hp style="width: ${hpWidth}%;"></div>
				<div class=bleed style="width: ${bleedWidth}%;"></div>
			</div>
		</div>
	`
})

