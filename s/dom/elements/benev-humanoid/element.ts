
import {html} from "@benev/slate"
import {MenuItem, Theater, op_effect} from "@benev/toolbox"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"

const notes: MenuItem = {
	name: "notes",
	panel: () => html`
		<h1>new notes menu</h1>
		<p>all new fancy menus system.</p>
		<p>settings menu totally redone.</p>
		<p>fixed the rendering pipeline bugs.</p>
	`,
}

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)

	return html`
		${op_effect.braille(use.context.realmOp.value, realm =>
			Theater([{
				stage: realm.stage,
				menu: [notes],
			}])
		)}
	`
})

