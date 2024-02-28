
import {html, reactor} from "@benev/slate"
import {Input, Menus, SettingsMenu, menu} from "@benev/toolbox"

import {Game} from "../../../types.js"
import {nexus} from "../../../nexus.js"
import {NotesMenu} from "./menus/notes.js"
import {LevelsMenu} from "./menus/levels.js"
import {QualityMenu} from "./menus/quality.js"

export const MenuSystem = nexus.shadow_view(use => (
		game: Game,
		render: (menus: Menus) => any,
	) => {

	const menus = use.once(() => new Menus([
		menu("notes", () => NotesMenu([game])),
		menu("levels", () => LevelsMenu([game])),
		menu("quality", () => QualityMenu([game])),
		menu("effects", () => SettingsMenu([game.stage])),
	]))

	use.mount(() => reactor.reaction(() => {
		if (menus.open.value)
			game.impulse.modes.enable("menus")
		else
			game.impulse.modes.disable("menus")
	}))

	use.mount(() => game.stage.pointerLocker.onLockChange(
		locked => menus.open.value = !locked)
	)

	use.mount(() => {
		const pressed = (fn: () => void) => (input: Input.Button) => {
			if (input.down && !input.repeat)
				fn()
		}
		const disposers = [
			game.impulse.on.menus.buttons.next(pressed(() => menus.next())),
			game.impulse.on.menus.buttons.previous(pressed(() => menus.previous())),
		]
		return () => disposers.forEach(d => d())
	})

	return html`${render(menus)}`
})

