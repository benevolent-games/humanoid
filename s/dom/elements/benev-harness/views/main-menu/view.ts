
import {Signal, html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"

export const MainMenuView = hnexus.shadow_view(use => (o: {
		video: Signal<HTMLVideoElement | null>
		audio: Signal<HTMLAudioElement | null>
		onClickExit: () => void
	}) => {

	use.styles(styles)

	return html`
		${o.video}
		${o.audio}
		<div class=plate>
			<h1>main menu</h1>
			<button @click=${o.onClickExit}>exit</button>
		</div>
	`
})

