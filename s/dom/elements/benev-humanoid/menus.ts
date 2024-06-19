
import {html} from "@benev/slate"
import {Input, Menus, menu} from "@benev/toolbox"

import {NotesMenu} from "./menus/notes.js"
import {EffectsMenu} from "./menus/effects.js"
import {hnexus} from "../benev-harness/nexus.js"
import {SettingsMenu} from "./menus/settings.js"
import {Game} from "../../../models/realm/types.js"

export const MenuSystem = hnexus.light_view(use => (
		game: Game,
		render: (menus: Menus) => any,
	) => {

	use.name("menu-system")

	const menus = use.once(() => new Menus([
		menu("notes", () => NotesMenu([game])),
		menu("effects", () => EffectsMenu([game])),
		menu("settings", () => SettingsMenu([game])),
	]))

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

