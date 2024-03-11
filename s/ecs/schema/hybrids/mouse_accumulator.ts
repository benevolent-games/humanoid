
import {HybridComponent} from "@benev/toolbox"
import {HuRealm} from "../../../models/realm/realm.js"

export class MouseAccumulator extends HybridComponent<HuRealm, {}> {
	movement = this.realm.tact.connectedDevices.mouse.make_accumulator()
	created() {}
	updated() {}
	deleted() {
		this.movement.dispose()
	}
}

