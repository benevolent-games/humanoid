
// import {ev} from "@benev/slate"
import {HuRealm} from "../models/realm/realm.js"
import warn_users_before_window_unload from "../tools/warn_users_before_window_unload.js"

export default (realm: HuRealm) => {

	// prevent problematic key behaviors that interfere with our gameplay keybinds
	function defaultPreventer(event: KeyboardEvent) {
		if (realm.stage.pointerLocker.locked)
			event.preventDefault()
		else if (event.code === "Tab")
			event.preventDefault()
	}
	window.addEventListener("keydown", defaultPreventer)
	window.addEventListener("keyup", defaultPreventer)

	// function alwaysPreventDefault(event: Event) {
	// 	event.preventDefault()
	// }
	// // ev(window, {
	// // 	pointermove: alwaysPreventDefault,
	// // 	touchstart: alwaysPreventDefault,
	// // 	touchmove: alwaysPreventDefault,
	// // 	touchend: alwaysPreventDefault,
	// // })

	// prevent ctrl+w instaclose accidents
	warn_users_before_window_unload()
}

