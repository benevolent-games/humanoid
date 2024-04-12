
import {Rapier, Vec3, babyloid, logSlow, vec3} from "@benev/toolbox"

import {gimbaltool} from "../../tools/gimbaltool.js"
import {behavior, logic, responder, system} from "../hub.js"
import {Camera} from "../components/hybrids/camera.js"
import {Capsule} from "../components/hybrids/capsule.js"
import {Health, Stamina} from "../components/topics/warrior.js"
import {Controllable, Gimbal} from "../components/plain_components.js"

export const ui_health = system("health ui", ({realm, world}) => [

	responder("show and hide health ui")
		.select({Controllable, Health})
		.respond(() => {
			realm.ui.personalHealth.enabled = true
			return () => realm.ui.personalHealth.enabled = false
		}),

	behavior("send health values to the ui")
		.select({Controllable, Health})
		.logic(() => ({components: {health}}) => {
			realm.ui.personalHealth.hp = health.hp
			realm.ui.personalHealth.bleed = health.bleed
		}),

	behavior("send stamina values while we're at it")
		.select({Controllable, Stamina})
		.logic(() => ({components: {stamina}}) => {
			realm.ui.personalHealth.stamina = stamina.juice
		}),

	logic("always reset the target healthbar", () => () => {
		realm.ui.targetHealth = {enabled: false, hp: 0, bleed: 0, stamina: 0}
	}),

	behavior("when you aim at somebody, reveal their health")
		.select({Controllable, Camera, Gimbal, Capsule})
		.logic(() => ({components: {camera, gimbal, capsule}}) => {
			const straight = [0, 0, 1] as Vec3
			const direction = gimbaltool(gimbal).rotate(straight)
			const origin = babyloid.to.vec3(camera.node.globalPosition)

			const myCapsule = capsule.capsule.collider

			const hits = realm.finder.rayCastForCapsules(world, {
				maxHits: null,
				origin,
				direction,
				maxDistance: 300,
				ignoreColliders: [myCapsule],
			})

			for (const hit of hits) {
				if (hit.collider !== myCapsule && hit.entity.has({Health, Stamina})) {
					const {health, stamina} = hit.entity.components
					realm.ui.targetHealth = {
						enabled: true,
						hp: health.hp,
						bleed: health.bleed,
						stamina: stamina.juice,
					}
				}
			}
		}),
])

