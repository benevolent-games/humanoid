
import {babyloid} from "@benev/toolbox"

import {behavior, logic, responder, system} from "../hub.js"
import {Camera} from "../components/hybrids/camera.js"
import {Capsule} from "../components/hybrids/capsule.js"
import {Health, Stamina} from "../components/topics/warrior.js"
import {AimTarget, Controllable} from "../components/plain_components.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"

const target_healthbar_lifespan = 2

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

	logic("always reset the target healthbar", () => tick => {
		const [aimEntity] = world.query({AimTarget}).matches
		const {aimTarget} = aimEntity.components
		const since = tick.gametime - aimTarget.lastAimTime
		if (since > target_healthbar_lifespan) {
			realm.ui.targetHealth.enabled = false
			aimTarget.recentTargetEntityId = null
		}
		else if (aimTarget.recentTargetEntityId === null) {
			realm.ui.targetHealth.enabled = false
		}
	}),

	behavior("when you aim at somebody, reveal their health")
		.select({Camera})
		.logic(tick => entity => {
			const {components: {camera}} = entity
			const origin = babyloid.to.vec3(camera.node.globalPosition)

			const quaternion = camera.node.absoluteRotation
			const forward = new Vector3(0, 0, -1)
			const directionVector = forward.applyRotationQuaternion(quaternion)
			const direction = babyloid.to.vec3(directionVector)

			let myCapsule = entity.has({Capsule})
				? entity.components.capsule.capsule.collider
				: null

			const hits = realm.finder.rayCastForCapsules(world, {
				origin,
				direction,
				maxDistance: 300,
				ignoreColliders: myCapsule ? [myCapsule] : []
			})

			const goodHits = hits.filter(hit => (
				hit.collider !== myCapsule &&
				hit.entity.has({Health, Stamina})
			))

			const [aimEntity] = world.query({AimTarget}).matches
			const {aimTarget} = aimEntity.components

			const [hit] = goodHits
			if (hit && hit.entity.has({Health, Stamina})) {
				aimTarget.lastAimTime = tick.gametime
				aimTarget.targetEntityId = hit.entity.id
				aimTarget.recentTargetEntityId = hit.entity.id
			}
			else {
				aimTarget.targetEntityId = null
			}
		}),

	logic("show aim target health", () => () => {
		const [aimEntity] = world.query({AimTarget}).matches
		const {aimTarget} = aimEntity.components
		if (!aimTarget.recentTargetEntityId)
			return

		const target = world.maybe(aimTarget.recentTargetEntityId)
		if (!target) {
			aimTarget.recentTargetEntityId = null
			return
		}

		if (target.has({Health, Stamina})) {
			const {health, stamina} = target.components
			Object.assign(realm.ui.targetHealth, {
				enabled: true,
				hp: health.hp,
				bleed: health.bleed,
				stamina: stamina.juice,
			})
		}
	}),
])

