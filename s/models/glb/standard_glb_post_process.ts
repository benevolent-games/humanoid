
import {fix_animation_groups} from "@benev/toolbox"

import {HuGameplan} from "../../gameplan.js"
import {GlbPostProcess} from "./parts/types.js"
import {setup_lods} from "./parts/setup_lods.js"
import {kill_lights} from "./parts/kill_lights.js"
import {LoadingDock} from "../planning/loading_dock.js"
import {config_foliage} from "./parts/config_foliage.js"
import {set_max_light_limit} from "./parts/set_max_light_limit.js"
import {load_and_replace_shaders} from "./parts/load_and_replace_shaders.js"

export function standard_glb_post_process({gameplan, loadingDock}: {
		gameplan: HuGameplan
		loadingDock: LoadingDock
	}): GlbPostProcess {

	const {quality} = gameplan

	return async container => {
		kill_lights(container)

		await load_and_replace_shaders({container, gameplan, loadingDock})

		set_max_light_limit({
			container,
			maxLights: (
				quality === "fancy" ? 16 :
				quality === "mid" ? 8 :
				2
			),
		})

		fix_animation_groups(container.animationGroups)

		config_foliage({
			container,
			allowFoliage: (
				quality === "fancy" ? true :
				quality === "mid" ? true :
				false
			),
		})

		setup_lods(container)
	}
}

