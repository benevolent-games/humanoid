
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"

export const GameplayView = hnexus.shadow_view(use => (o: {}) => {

	use.name("gameplay")
	use.styles(styles)

	return html`
		<p>imagine that gameplay is happening here lol</p>
	`
})

