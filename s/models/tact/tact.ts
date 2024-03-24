
import {Tact} from "@benev/toolbox"
import {HuBindings, huBindings} from "./bindings.js"

export class HuTact extends Tact<HuBindings> {
	connectedDevices = {
		keyboard: new HuTact.devices.Keyboard(window),
		mouse: new HuTact.devices.PointerMovements(window, "mouse"),
		mouseButtons: new HuTact.devices.MouseButtons(window),
	}

	constructor() {
		super(window, huBindings())

		for (const device of Object.values(this.connectedDevices))
			this.devices.add(device)

		this.modes.assign("universal", "menus")
	}
}

