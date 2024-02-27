
import {Op, html} from "@benev/slate"
import {Theater, op_effect} from "@benev/toolbox"

import {styles} from "./styles.js"
import {MenuSystem} from "./menus.js"
import {nexus} from "../../../nexus.js"

export const BenevHumanoid = nexus.shadow_component(use => {
	use.styles(styles)
	const zoneOp = use.context.zoneOp.value
	const realmOp = use.context.realmOp.value

	return html`
		${op_effect.braille(Op.all(realmOp, zoneOp), ([realm, zone]) =>
			MenuSystem([{realm, zone}, menus =>
				Theater([{
					menus,
					stage: realm.stage,
					leadButton: "tab",
					onLeadToggled: open => {
						if (!open)
							realm.stage.pointerLocker.lock()
					},
				}])
			])
		)}
	`
})

