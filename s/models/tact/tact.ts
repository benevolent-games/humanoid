
import {Tact} from "@benev/toolbox"
import {HuBindings, huBindings} from "./bindings.js"
import {Stick} from "@benev/toolbox/x/tact/nubs/stick/device.js"
import {Movements} from "@benev/toolbox/x/tact/devices/movements.js"

export class HuTact extends Tact<HuBindings> {
	connectedDevices = {
		keyboard: new HuTact.devices.Keyboard(window),
		mouse: new HuTact.devices.PointerMovements(window, "mouse"),
		mouseButtons: new HuTact.devices.MouseButtons(window),
		stick: new Stick("stick"),
		lookpad: new Movements("lookpad"),
	}

	constructor() {
		super(window, huBindings())

		for (const device of Object.values(this.connectedDevices))
			this.devices.add(device)

		this.modes.assign("universal", "menus")
	}
}

