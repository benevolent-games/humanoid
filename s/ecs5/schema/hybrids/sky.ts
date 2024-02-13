
import {scalar} from "@benev/toolbox"
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {make_skybox} from "../../../tools/make_skybox.js"
import {HybridComponent} from "@benev/toolbox/x/ecs/ecs5.js"

export class Sky extends HybridComponent<HumanoidRealm, {size: number, rotation: number}> {

	skybox = make_skybox({
		scene: this.realm.stage.scene,
		size: this.state.size,
		links: this.realm.skybox_links,
		yaw: scalar.radians.from.degrees(this.state.rotation),
	})

	init() {}
	deleted() {
		this.skybox.dispose()
	}
}

