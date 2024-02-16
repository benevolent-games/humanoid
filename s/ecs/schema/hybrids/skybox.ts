
import {scalar, HybridComponent} from "@benev/toolbox"
import {make_skybox} from "../../../tools/make_skybox.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Skybox extends HybridComponent<HumanoidRealm, {
		size: number
		rotate_degrees: number
	}> {

	skybox = make_skybox({
		size: this.state.size,
		scene: this.realm.stage.scene,
		links: this.realm.links.skybox,
		yaw: scalar.radians.from.degrees(this.state.rotate_degrees),
	})

	created() {}
	updated() {}
	deleted() {
		this.skybox.dispose()
	}
}

