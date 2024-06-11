
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {QualitySelector} from "../../../../../../views/quality-selector/view.js"

export const SettingsPanel = hnexus.shadow_view(use => () => {
	use.name("settings-panel")
	use.styles(styles)

	return html`
		<section>
			${QualitySelector([])}
		</section>
	`
})

