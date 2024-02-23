
import {scalar, HybridComponent} from "@benev/toolbox"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Skybox extends HybridComponent<HumanoidRealm, {
		size: number
		rotate_degrees: number
	}> {

	skybox = this.realm.assets.skyboxes.sky_01({
		size: this.state.size,
		yaw: scalar.radians.from.degrees(this.state.rotate_degrees),
	})

	created() {}
	updated() {}
	deleted() {
		this.skybox.dispose()
	}
}

