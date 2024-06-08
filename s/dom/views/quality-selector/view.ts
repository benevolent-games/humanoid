
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../elements/benev-harness/nexus.js"
import {Quality, normalizeQualityString} from "../../../tools/quality.js"

export const QualitySelector = hnexus.shadow_view(use => () => {
	use.name("quality-selector")
	use.styles(styles)

	const {qualityMachine} = use.context

	function handle(event: InputEvent) {
		const select = event.target as HTMLSelectElement
		use.context.qualityMachine.quality = normalizeQualityString(select.value)
	}

	function option(q: Quality, icon: string) {
		return html`
			<option
				value="${q}"
				?selected="${q === qualityMachine.quality}">
				${icon} ${q} quality
			</option>
		`
	}

	return html`
		<select part=select @change=${handle}>
			${option("potato", "🥔")}
			${option("mid", "😐")}
			${option("fancy", "🧐")}
		</select>
	`
})

