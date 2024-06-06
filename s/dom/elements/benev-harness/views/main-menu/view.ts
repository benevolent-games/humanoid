
import {Signal, html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"

export const MainMenuView = hnexus.shadow_view(use => (o: {
		video: Signal<HTMLVideoElement | null>
		audio: Signal<HTMLAudioElement | null>
		onClickExit: () => void
	}) => {

	use.name("main-menu")
	use.styles(styles)

	const benevLogo = "/assets/graphics/benevolent.svg"
	const heathenLogo = "/assets/graphics/heathen-logo/heathen-logo-red.webp"

	return html`
		${o.video}
		${o.audio}
		<div class=container>

			<div class=banner>
				<img src="${heathenLogo}" alt=""/>
				<nav>
					<button>news</button>
					<button>multiplayer</button>
					<button>settings</button>
					<button @click=${o.onClickExit}>exit</button>
					<button class=benev>
						<img src="${benevLogo}" alt=""/>
					</button>
				</nav>
			</div>

			<div class=plate></div>
		</div>
	`
})

