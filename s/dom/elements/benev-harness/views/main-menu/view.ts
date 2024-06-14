
import {RenderResult, html} from "@benev/slate"

import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {BPanel} from "./panels/b/panel.js"
import {GamePanel} from "./panels/game/panel.js"
import {SettingsPanel} from "./panels/settings/panel.js"
import {LevelImages, LevelName} from "./panels/game/levels.js"
import {when, onCarmackClick} from "../../../../../tools/zui.js"

type MenuItem = {name: string, label: RenderResult, panel: RenderResult}

export const MainMenuView = hnexus.shadow_view(use => (o: {
		video: HTMLVideoElement
		audio: HTMLAudioElement
		levelImages: LevelImages
		onClickExit: () => void
		onClickStartGame: (level: LevelName) => void
	}) => {

	use.name("main-menu")
	use.styles(styles)
	const selectedTab = use.signal("game")

	function isSelected(tabName: string) {
		return tabName === selectedTab.value
	}

	function navigate(tabName: string) {
		return () => {
			return selectedTab.value = tabName
		}
	}

	const tabs: MenuItem[] = [
		{
			name: "game",
			label: "game",
			panel: GamePanel([o]),
		},
		{
			name: "settings",
			label: "settings",
			panel: SettingsPanel([]),
		},
		{
			name: "b",
			label: html`<img src="${assets.benevLogo}" alt=""/>`,
			panel: BPanel([]),
		},
	]

	return html`
		${o.video}
		${o.audio}
		<div class=container>

			<div class=banner>
				<img src="${assets.heathenLogo}" alt=""/>

				<nav>
					${tabs.map(tab => html`
						<button
							?data-selected=${isSelected(tab.name)}
							${onCarmackClick(navigate(tab.name))}>
								${tab.label}
						</button>
					`)}

					<button class=exit @click=${o.onClickExit}>
						exit
					</button>
				</nav>
			</div>

			<div class=plate>
				<div class=content>
					${when(
						tabs.find(tab => isSelected(tab.name)),
						tab => tab.panel,
					)}
				</div>
			</div>
		</div>
	`
})

