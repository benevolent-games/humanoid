
import {scalar, HybridComponent} from "@benev/toolbox"
import {make_skybox} from "../../../tools/make_skybox.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Sky extends HybridComponent<HumanoidRealm, {
		size: number
		rotation: number
	}> {

	skybox = make_skybox({
		scene: this.realm.stage.scene,
		size: this.state.size,
		links: this.realm.skybox_links,
		yaw: scalar.radians.from.degrees(this.state.rotation),
	})

	created() {}
	updated() {}
	deleted() {
		this.skybox.dispose()
	}
}

