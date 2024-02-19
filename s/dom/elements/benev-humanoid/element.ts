
import {html} from "@benev/slate"
import {op_effect} from "@benev/toolbox"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Panel} from "../../views/panel/view.js"
import {Framerate} from "../../views/framerate.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)

	return html`
		${op_effect.braille(use.context.realmOp.value, realm => html`
			${realm.porthole.canvas}
			${Panel([realm])}
			<span class=info>${Framerate([])}</span>
		`)}
	`
})

