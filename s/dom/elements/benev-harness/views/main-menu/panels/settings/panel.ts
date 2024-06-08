
import {css, html} from "@benev/slate"
import {hnexus} from "../../../../nexus.js"
import {QualitySelector} from "../../../../../../views/quality-selector/view.js"

const styles = css``

export const SettingsPanel = hnexus.shadow_view(use => () => {
	use.name("settings-panel")
	use.styles(styles)

	return html`
		${QualitySelector([])}
	`
})

