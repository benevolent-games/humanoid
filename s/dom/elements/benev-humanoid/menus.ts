
import {html} from "@benev/slate"
import {Menus, SettingsMenu, menu} from "@benev/toolbox"

import {Game} from "../../../types.js"
import {nexus} from "../../../nexus.js"
import {NotesMenu} from "./menus/notes.js"
import {QualityMenu} from "./menus/quality.js"

export const MenuSystem = nexus.shadow_view(use => (
		game: Game,
		render: (menus: Menus) => any,
	) => {

	const {pointerLocker} = game.stage

	const menus = use.once(() => new Menus([
		menu("notes", () => NotesMenu([game])),
		menu("quality", () => QualityMenu([game])),
		menu("graphics", () => SettingsMenu([game.stage])),
	]))

	use.mount(() => pointerLocker.onLockChange(
		locked => menus.open.value = !locked)
	)

	return html`${render(menus)}`
})

