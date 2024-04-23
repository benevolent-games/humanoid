
import {levelScript} from "../types.js"
import setup_fog from "../sfx/setup_fog.js"
import setup_shadows from "../sfx/setup_shadows.js"

export default levelScript(async(realm, stuff) => {
	const shadows = setup_shadows(realm, stuff)

	const fog = setup_fog({
		stage: realm.stage,
		url: realm.gameplan.graphics.fog,
		particles: {
			count: 1000,
			alpha: 10 / 100,
			spinrate: 1,
			fadeRange: 2,
			sizes: [10, 20],
		},
	})

	return {dispose: () => {
		shadows.dispose()
		fog.dispose()
	}}
})

