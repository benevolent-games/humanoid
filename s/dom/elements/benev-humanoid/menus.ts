
import {html} from "@benev/slate"
import {Menus, SettingsMenu, menu} from "@benev/toolbox"

import {nexus} from "../../../nexus.js"
import {NotesMenu} from "./menus/notes.js"
import {QualityMenu} from "./menus/quality.js"
import {Zone} from "../../../models/zone/zone.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export const MenuSystem = nexus.shadow_view(use => (
		core: {realm: HumanoidRealm, zone: Zone},
		render: (menus: Menus) => any,
	) => {

	const {realm, zone} = core
	const {pointerLocker} = realm.stage

	const menus = use.once(() => new Menus([
		menu("notes", () => NotesMenu([realm, zone])),
		menu("quality", () => QualityMenu([realm])),
		menu("graphics", () => SettingsMenu([realm.stage])),
	]))

	use.mount(() => pointerLocker.onLockChange(
		locked => menus.open.value = !locked)
	)

	return html`${render(menus)}`
})

