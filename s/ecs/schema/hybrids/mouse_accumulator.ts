
import {HybridComponent} from "@benev/toolbox"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class MouseAccumulator extends HybridComponent<HumanoidRealm, {}> {
	movement = this.realm.impulse.devices.mouse.make_accumulator()
	created() {}
	updated() {}
	deleted() {
		this.movement.dispose()
	}
}

