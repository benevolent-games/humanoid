
import {css, html, is} from "@benev/slate"
import {Menus, scalar} from "@benev/toolbox"

import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"
import {ParryReport} from "../../../../../models/activity/reports/parry.js"
import {icon_tabler_chevron_up} from "../../../../icons/tabler/chevron-up.js"
import {meleeReport} from "../../../../../models/activity/reports/melee/melee-report.js"

export const Reticle = nexus.shadow_view(use => (game: Game, menus: Menus) => {
	use.name("reticle")
	use.styles(css`
		.shell {
			position: absolute;
			inset: 0;
			width: 1em;
			height: 1em;
			margin: auto;

			color: white;
			transition: 200ms linear opacity;

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

		.angle:is(.alpha, .bravo) {
			color: white;
			z-index: 1;
		}

		.angle.lock > svg {
			transform: translate(0, -0.6em);
		}
	`)

	const {enabled, size, opacity, data} = game.ui.reticle
	const activity = data?.activity
	const meleeAim = data?.meleeAim

	const {mode, angleAlpha, angleBravo, angleLock} = (() => {
		const angle = meleeAim?.angle ?? null
		if (activity?.kind === "equip") {
			return {
				angleAlpha: null,
				angleBravo: null,
				angleLock: null,
				mode: "plain",
			}
		}
		else if (activity?.kind === "parry") {
			const {protective} = new ParryReport(activity)
			return {
				angleAlpha: null,
				angleBravo: null,
				angleLock: null,
				mode: protective
					? "parry-protective"
					: "parry"
			}
		}
		else if (activity?.kind === "melee") {
			const {activeManeuver} = meleeReport(activity)
			const a = angle ?? 0
			return {
				angleAlpha: a,
				angleBravo: null,
				angleLock: activeManeuver.next?.maneuver.angle
				?? activeManeuver.chart.maneuver.angle,
				mode: activeManeuver.phase === "release"
					? "attack-release"
					: "attack",
			}
		}
		return {
			mode: "plain",
			angleAlpha: angle,
			angleBravo: null,
			angleLock: null,
		}
	})()

	const stylize = (a: number | null) => is.defined(a)
		? `transform: rotate(${scalar.radians.to.degrees(a)}deg);`
		: `opacity: 0;`

	const angleAlphaStyle = stylize(angleAlpha)
	const angleBravoStyle = stylize(angleBravo)
	const angleLockStyle = stylize(angleLock)

	return enabled ? html`
		<div
			class="shell"
			?data-active="${!menus.open.value}"
			data-mode="${mode}"
			style="font-size: ${size}em; opacity: ${opacity};">
				<div class="aim graphic">
					<div class="point"></div>
				</div>
				<div
					class="angle alpha graphic"
					style="${angleAlphaStyle}">
					${icon_tabler_chevron_up}
				</div>
				<div
					class="angle bravo graphic"
					style="${angleBravoStyle}">
					${icon_tabler_chevron_up}
				</div>
				<div
					class="angle lock graphic"
					style="${angleLockStyle}">
					${icon_tabler_chevron_up}
				</div>
		</div>
	` : html``
})

