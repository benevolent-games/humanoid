
import {css, html} from "@benev/slate"
import {hnexus} from "../../../nexus.js"

const styles = css``

export const SettingsPanel = hnexus.shadow_view(use => () => {
	use.name("settings-panel")
	use.styles(styles)

	return html`
		<div>settings panel</div>
	`
})

