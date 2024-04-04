
import {HybridComponent} from "../../hub.js"

export class MouseAccumulator extends HybridComponent<{}> {
	movement = this.realm.tact.connectedDevices.mouse.make_accumulator()
	created() {}
	updated() {}
	deleted() {
		this.movement.dispose()
	}
}

