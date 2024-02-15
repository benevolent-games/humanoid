
import {Vec2} from "@benev/toolbox"
import {HybridComponent} from "@benev/toolbox"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class MouseAccumulator extends HybridComponent<HumanoidRealm, {}> {
	movement = this.realm.impulse.devices.mouse.make_accumulator()

	invert_y_axis([x, y]: Vec2): Vec2 {
		return [x, y * -1]
	}

	created() {}
	updated() {}
	deleted() {
		this.movement.dispose()
	}
}

