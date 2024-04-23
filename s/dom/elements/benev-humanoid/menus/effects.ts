
import {css, html} from "@benev/slate"
import {EffectsPanel, EffectsPanelData} from "@benev/toolbox"

import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"
import {Ui} from "../../../../models/ui/ui.js"
import {ShadowsPanel} from "./panels/shadows.js"

export type HuBestorageData = {
	shadows: Ui["shadows"]
} & EffectsPanelData

export const EffectsMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("effects-menu")
	use.styles(css``)

	return EffectsPanel(
		[game.stage, game.bestorage],
		{content: html`${ShadowsPanel([game, game.bestorage])}`},
	)
})

