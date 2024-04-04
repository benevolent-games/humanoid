
import {HybridComponent} from "../../hub.js"

export class LookpadAccumulator extends HybridComponent<{}> {
	movement = this.realm.tact.connectedDevices.lookpad.make_accumulator()
	created() {}
	updated() {}
	deleted() {
		this.movement.dispose()
	}
}

