
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {benevLinks} from "../../../../../../renderers/benev-links.js"

export const BPanel = hnexus.shadow_view(use => () => {
	use.name("b-panel")
	use.styles(styles)

	return html`
		<section>
			${benevLinks()}
		</section>
	`
})

