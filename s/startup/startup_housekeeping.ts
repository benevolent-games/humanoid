
import {HuRealm} from "../models/realm/realm.js"
import warn_users_before_window_unload from "../tools/warn_users_before_window_unload.js"

export default (realm: HuRealm) => {

	// menu button toggles pointerlock
	realm.tact.inputs.universal.buttons.menu_toggle.on(input => {
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

	// // controls spawning of humanoids and spectator cams
	// const respawner = new Respawner(world)
	// respawner.respawn()
	// realm.tact.inputs.humanoid.buttons.respawn.on(button => {
	// 	if (button.down && !button.repeat)
	// 		respawner.respawn()
	// })
	// realm.tact.inputs.humanoid.buttons.bot_spawn.on(button => {
	// 	if (button.down && !button.repeat)
	// 		respawner.spawnBot()
	// })
	// realm.tact.inputs.humanoid.buttons.bot_delete.on(button => {
	// 	if (button.down && !button.repeat)
	// 		respawner.deleteBot()
	// })

	// // establish a level switcher for cycling levels
	// const levelSwitcher = new LevelSwitcher(world, realm.gameplan)

	// // switch level when we press the key
	// realm.tact.inputs.humanoid.buttons.level_swap.on(button => {
	// 	if (button.down && !button.repeat)
	// 		levelSwitcher.next()
	// })

	// return {levelSwitcher}
}

