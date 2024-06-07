
import {Signal, RenderResult, html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {when} from "../../../../../tools/zui.js"
import {GamePanel} from "./panels/game-panel.js"
import {SettingsPanel} from "./panels/settings-panel.js"

type MenuItem = [string, RenderResult]

export const MainMenuView = hnexus.shadow_view(use => (o: {
		video: Signal<HTMLVideoElement | null>
		audio: Signal<HTMLAudioElement | null>
		onClickExit: () => void
	}) => {

	use.name("main-menu")
	use.styles(styles)
	const selectedTab = use.signal("game")

	function switchTab(name: string) {
		selectedTab.value = name
	}

	const tabs: MenuItem[] = [
		["game", GamePanel([])],
		["settings", SettingsPanel([])],
	]

	return html`
		${o.video}
		${o.audio}
		<div class=container>

			<div class=banner>
				<img src="${assets.heathenLogo}" alt=""/>
				<nav>
					${tabs.map(([name]) => html`
						<button
							@click=${() => switchTab(name)}
							?data-selected=${name === selectedTab.value}>
								${name}
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
						tabs.find(([name]) => name === selectedTab.value),
						([,content]) => content,
					)}
				</div>
			</div>
		</div>
	`
})

