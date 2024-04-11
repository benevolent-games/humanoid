
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
			padding: 0.2em;
			gap: 0.2em;

			> * {
				flex: 1 0 0;
				height: 0.2em;
			}
		}

		.bar {
			display: flex;
			> * {
				flex: 0 0 auto;
				height: 100%;
			}

		}
		.stamina {
			background: #4408;
			justify-content: end;
			.juice { background: #ff0; }
		}

		.health {
			background: #4008;
			justify-content: start;
			.hp { background: #f00; }
			.bleed { background: #a00; }
		}
	`)

	const {hp, bleed, stamina} = game.ui.health
	// const stamina = 0.67
	// const hp = 0.50
	// const bleed = 0.14

	const hpWidth = scalar.clamp(hp - bleed) * 100
	const bleedWidth = bleed * 100

	return html`
		<div class=plate>
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

