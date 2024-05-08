
import {Meshoid, nquery} from "@benev/toolbox"
import {debounce, clone, reactor} from "@benev/slate"

import {Ui} from "../../ui/ui.js"
import {HuRealm} from "../../realm/realm.js"
import {LevelStuff} from "../../../ecs/components/hybrids/level.js"
import {DirectionalLight} from "@babylonjs/core/Lights/directionalLight.js"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"
import {CascadedShadowGenerator} from "@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js"

export default (realm: HuRealm, {level}: LevelStuff) => {
	const sunlight = level.lights[0] as DirectionalLight

	let shadowGenerator: ShadowGenerator | CascadedShadowGenerator
	let unlisten = () => {}

	const dispose = () => {
		if (shadowGenerator)
			shadowGenerator.dispose()
		if (unlisten)
			unlisten()
	}

	const applyShadowSettings = debounce(100, (data: Ui["shadows"]) => {
		dispose()

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

			const shadowCasters = new Set<Meshoid>()
			const shadowReceivers = new Set<Meshoid>()

			// apply mesh/material shadow settings
			for (const mesh of level.meshes) {
				const shadows = nquery(mesh).tag("shadows") ?? true
				const isGrass = nquery(mesh).tag("grass") || nquery(mesh).name("grass")

				if (isGrass) {
					if (data.basics.grass_casts_shadows)
						shadowCasters.add(mesh)
					if (data.basics.grass_receives_shadows)
						shadowReceivers.add(mesh)
				}

				if (shadows === "cast") {
					shadowCasters.add(mesh)
					shadowGenerator.addShadowCaster(mesh)
				}
				else if (shadows === "receive") {
					shadowReceivers.add(mesh)
					mesh.receiveShadows = true
				}
				else if (shadows === true) {
					shadowCasters.add(mesh)
					shadowReceivers.add(mesh)
					mesh.receiveShadows = true
					shadowGenerator.addShadowCaster(mesh)
				}
			}

			for (const mesh of shadowCasters)
				shadowGenerator.addShadowCaster(mesh)

			for (const mesh of shadowReceivers)
				mesh.receiveShadows = true

			unlisten = realm.shadowManager.attachListener({
				addCaster: mesh => shadowGenerator.addShadowCaster(mesh),
				removeCaster: mesh => shadowGenerator.removeShadowCaster(mesh),
			})
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
			dispose()
		},
	}
}

