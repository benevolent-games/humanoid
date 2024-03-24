
import {html} from "@benev/slate"
import {Theater, op_effect} from "@benev/toolbox"

import {styles} from "./styles.js"
import {MenuSystem} from "./menus.js"
import {nexus} from "../../../nexus.js"
import {Reticule} from "./views/reticule/view.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)
	const gameOp = use.context.gameOp.value

	return html`
		${op_effect.braille(gameOp, game =>
			MenuSystem(game, menus => html`
				${Reticule([game, menus])}
				${Theater(
					[{
						menus,
						stage: game.stage,
						leadButton: "tab",
						onLeadToggled: () => game.stage.pointerLocker.toggle(),
					}],
					{content: html`${Reticule([game, menus])}`},
				)}
			`)
		)}
	`
})

