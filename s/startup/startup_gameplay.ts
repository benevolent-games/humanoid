
import {World} from "@benev/toolbox"

import {HuRealm} from "../models/realm/realm.js"
import {Respawner} from "../models/respawner/respawner.js"
import {LevelSwitcher} from "../models/level_switcher/switcher.js"
import warn_users_before_window_unload from "../tools/warn_users_before_window_unload.js"

export default (realm: HuRealm, world: World<HuRealm>) => {

	// menu button toggles pointerlock
	realm.impulse.on.universal.buttons.menu_toggle(input => {
		if (input.down && !input.repeat)
			realm.stage.pointerLocker.toggle()
	})

	// prevent problematic key behaviors that interfere with our gameplay keybinds
	function defaultPreventer(event: KeyboardEvent) {
		if (realm.stage.pointerLocker.locked)
			event.preventDefault()
		else if (event.code === "Tab")
			event.preventDefault()
	}
	window.addEventListener("keydown", defaultPreventer)
	window.addEventListener("keyup", defaultPreventer)

	// prevent ctrl+w instaclose accidents
	warn_users_before_window_unload()

	// controls spawning of humanoids and spectator cams
	const respawner = new Respawner(world)
	respawner.respawn()
	realm.impulse.on.humanoid.buttons.respawn(button => {
		if (button.down && !button.repeat)
			respawner.respawn()
	})

	// establish a level switcher for cycling levels
	const levelSwitcher = new LevelSwitcher(world, realm.gameplan, respawner)

	// switch level when we press the key
	realm.impulse.on.humanoid.buttons.level_swap(button => {
		if (button.down && !button.repeat)
			levelSwitcher.next()
	})

	return {levelSwitcher, respawner}
}

