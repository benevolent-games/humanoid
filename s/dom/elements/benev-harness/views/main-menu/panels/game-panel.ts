
import {css, html} from "@benev/slate"
import {hnexus} from "../../../nexus.js"

const styles = css``

export const GamePanel = hnexus.shadow_view(use => () => {
	use.name("game-panel")
	use.styles(styles)

	return html`
		<div>game panel</div>
	`
})

