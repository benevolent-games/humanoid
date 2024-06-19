
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
// import {onCarmackClick} from "../../../../../tools/zui.js"

export const GameplayView = hnexus.shadow_view(use => (o: {
		onClickBackToMenu: () => void
	}) => {

	use.name("gameplay")
	use.styles(styles)

	return html`
		<heathen-game></heathen-game>
	`

	// return html`
	// 	<p>imagine that gameplay is happening here lol</p>
	// 	<button class="based fx" ${onCarmackClick(o.onClickBackToMenu)}>back</button>
	// `
})

