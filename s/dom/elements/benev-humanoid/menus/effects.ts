
import {clone, css, html} from "@benev/slate"
import {Bestorage} from "@benev/toolbox/x/ui/theater/views/effects-panel/parts/bestorage.js"
import {EffectsPanel, EffectsPanelData, defaultEffectsData} from "@benev/toolbox"

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

	const bestorage = use.once(() => new Bestorage<HuBestorageData>({
		...defaultEffectsData(),
		resolution: game.stage.porthole.resolution * 100,
		shadows: clone(game.ui.shadows),
	}))

	return EffectsPanel(
		[game.stage, bestorage],
		{content: html`${ShadowsPanel([game, bestorage])}`},
	)
})

