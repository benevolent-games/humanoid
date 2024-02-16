
import {Impulse} from "@benev/toolbox"
import {HumanoidBinds, humanoid_binds} from "./binds.js"

export class HumanoidImpulse extends Impulse<HumanoidBinds> {
	devices = {
		keyboard: new HumanoidImpulse.Keyboard(window),
		mouse: new HumanoidImpulse.PointerMovements(window, "mouse"),
		mouseButtons: new HumanoidImpulse.PointerButtons(window),
	}

	constructor() {
		super({
			binds: humanoid_binds(),
			modes: ["universal", "humanoid"],
		})

		for (const device of Object.values(this.devices))
			this.add(device)
	}
}

