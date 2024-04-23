
import {nquery} from "@benev/toolbox"
import {debounce, clone, reactor} from "@benev/slate"

import {Ui} from "../ui/ui.js"
import {HuRealm} from "../realm/realm.js"
import {LevelStuff} from "../../ecs/components/hybrids/level.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"

export function setup_shadows(realm: HuRealm, stuff: LevelStuff) {
	const sunlight = stuff.level.lights[0] as DirectionalLight
	let shadowGenerator: ShadowGenerator | CascadedShadowGenerator

	const applyShadowSettings = debounce(100, (data: Ui["shadows"]) => {
		if (shadowGenerator)
			shadowGenerator.dispose()

		const d = realm.ui.shadows.basics.sunDistance
		sunlight.position.copyFrom(sunlight.direction.multiplyByFloats(-d, -d, -d))

		Object.assign(sunlight, data.light)

		if (realm.stage.rendering.effects?.scene?.shadowsEnabled) {
			if (data.cascaded.enabled) {
				shadowGenerator = new CascadedShadowGenerator(data.generator.mapSize, sunlight)
				shadowGenerator.filter = data.basics.filter
				shadowGenerator.filteringQuality = data.basics.filteringQuality
				Object.assign(shadowGenerator, data.generator, data.cascaded)
			}
			else {
				shadowGenerator = new ShadowGenerator(data.generator.mapSize, sunlight)
				shadowGenerator.filter = data.basics.filter
				shadowGenerator.filteringQuality = data.basics.filteringQuality
				Object.assign(shadowGenerator, data.generator)
			}

			for (const mesh of stuff.level.meshes) {
				if (nquery(mesh).tag("grass") || nquery(mesh).name("grass")) {
					mesh.receiveShadows = data.basics.grass_receives_shadows
					if (data.basics.grass_casts_shadows)
						shadowGenerator.addShadowCaster(mesh)
				}
				else {
					mesh.receiveShadows = true
					shadowGenerator.addShadowCaster(mesh)
				}
			}
		}
	})

	applyShadowSettings(clone(realm.ui.shadows))

	const stop1 = reactor.reaction(
		() => clone(realm.ui.shadows),
		data => applyShadowSettings(data),
	)

	const stop2 = realm.stage.rendering.onEffectsChange(
		() => applyShadowSettings(clone(realm.ui.shadows))
	)

	return {
		dispose() {
			stop1()
			stop2()
		},
	}
}

