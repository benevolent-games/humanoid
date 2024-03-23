
import {html, reactor} from "@benev/slate"
import {Input, Menus, SettingsMenu, menu} from "@benev/toolbox"

import {Game} from "../../../types.js"
import {nexus} from "../../../nexus.js"
import {NotesMenu} from "./menus/notes.js"
import {ConfigMenu} from "./menus/config.js"
import {LevelsMenu} from "./menus/levels.js"

export const MenuSystem = nexus.shadow_view(use => (
		game: Game,
		render: (menus: Menus) => any,
	) => {

	const menus = use.once(() => new Menus([
		menu("notes", () => NotesMenu([game])),
		menu("levels", () => LevelsMenu([game])),
		menu("settings", () => ConfigMenu([game])),
		menu("effects", () => SettingsMenu([game.stage])),
	]))

	use.mount(() => reactor.reaction(() => {
		const {modes} = game.tact
		if (menus.open.value) {
			modes.enable("menus")
			modes.disable("humanoid")
		}
		else {
			modes.disable("menus")
			modes.enable("humanoid")
		}
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
			game.tact.inputs.menus.buttons.next.on(pressed(() => menus.next())),
			game.tact.inputs.menus.buttons.previous.on(pressed(() => menus.previous())),
		]
		return () => disposers.forEach(d => d())
	})

	return html`${render(menus)}`
})

