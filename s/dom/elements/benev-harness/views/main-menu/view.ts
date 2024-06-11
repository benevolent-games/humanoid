
import {RenderResult, html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {GamePanel} from "./panels/game/panel.js"
import {LevelImages} from "./panels/game/levels.js"
import {SettingsPanel} from "./panels/settings/panel.js"
import {when, onCarmackClick} from "../../../../../tools/zui.js"

type MenuItem = [string, RenderResult]

export const MainMenuView = hnexus.shadow_view(use => (o: {
		video: HTMLVideoElement
		audio: HTMLAudioElement
		levelImages: LevelImages
		onClickExit: () => void
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
		["game", GamePanel([o])],
		["settings", SettingsPanel([])],
	]

	return html`
		${o.video}
		${o.audio}
		<div class=container>

			<div class=banner>
				<img src="${assets.heathenLogo}" alt=""/>

				<nav>
					${tabs.map(([tabName]) => html`
						<button
							?data-selected=${isSelected(tabName)}
							${onCarmackClick(navigate(tabName))}>
								${tabName}
						</button>
					`)}

					<button class=exit @click=${o.onClickExit}>
						exit
					</button>

					<button class=benev>
						<img src="${assets.benevLogo}" alt=""/>
					</button>
				</nav>
			</div>

			<div class=plate>
				<div class=content>
					${when(
						tabs.find(([tabName]) => isSelected(tabName)),
						([,content]) => content,
					)}
				</div>
			</div>
		</div>
	`
})

