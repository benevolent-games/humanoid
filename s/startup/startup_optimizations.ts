
import {Rendering} from "@benev/toolbox"
import {HuRealm} from "../models/realm/realm.js"

export default async(realm: HuRealm) => {
	const everything = Rendering.effects.everything()

	// use lower quality stuff in potato mode
	if (realm.gameplan.quality === "potato") {
		realm.stage.porthole.resolution = 0.5
		realm.stage.rendering.setEffects({
			antialiasing: {fxaa: false, samples: 0},
			scene: {
				...everything.scene,
				shadowsEnabled: false,
				environmentIntensity: 0.6,
			},
		})
	}
	else {
		realm.stage.porthole.resolution = 1.0
		realm.stage.rendering.setEffects({
			antialiasing: {fxaa: false, samples: 8},
			scene: {
				...everything.scene,
				shadowsEnabled: true,
				environmentIntensity: 0.6,
			},
		})
	}
}

