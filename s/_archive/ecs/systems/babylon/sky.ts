
import {scalar} from "@benev/toolbox"
import {behavior} from "../../hub.js"
import {make_skybox} from "../../../tools/make_skybox.js"

export const sky = behavior("sky")
	.select("sky")
	.lifecycle(realm => init => {

	const sky = make_skybox({
		scene: realm.stage.scene,
		size: init.sky.size,
		links: realm.skybox_links,
		yaw: scalar.radians.from.degrees(init.sky.rotation),
	})

	return {
		tick() {},
		end() {
			sky.dispose()
		},
	}
})

