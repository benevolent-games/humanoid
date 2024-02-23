
import {Op, html} from "@benev/slate"
import {Theater, op_effect, settingsMenu} from "@benev/toolbox"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {notesMenu} from "./menus/notes.js"
import {qualityMenu} from "./menus/quality.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)
	const {realmOp, zoneOp} = use.context

	return html`
		${op_effect.braille(Op.all(realmOp.value, zoneOp.value), ([realm, zone]) =>
			Theater([{
				stage: realm.stage,
				menus: [
					settingsMenu(),
					qualityMenu(realm),
					notesMenu(realm, zone),
				],
			}])
		)}
	`
})

