
import {css, html} from "@benev/slate"
import {EffectsPanel, EffectsPanelData} from "@benev/toolbox"

import {nexus} from "../../../../nexus.js"
import {Ui} from "../../../../models/ui/ui.js"
import {ShadowsPanel} from "./panels/shadows.js"
import {Game} from "../../../../models/realm/types.js"

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

