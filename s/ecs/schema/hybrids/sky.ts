
import {scalar, HybridComponent} from "@benev/toolbox"
import {make_image_based_lighting_environment, make_skybox} from "../../../tools/make_skybox.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Sky extends HybridComponent<HumanoidRealm, {
		size: number
		rotation: number
	}> {

	skybox = make_skybox({
		scene: this.realm.stage.scene,
		size: this.state.size,
		links: this.realm.links.skybox,
		yaw: scalar.radians.from.degrees(this.state.rotation),
	})

	image_based_lighting = make_image_based_lighting_environment(
		this.realm.stage.scene,
		this.realm.links.image_based_lighting,
	)

	created() {}
	updated() {}
	deleted() {
		this.skybox.dispose()
		this.image_based_lighting.dispose()
	}
}

