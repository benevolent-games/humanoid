
import {behavior, system} from "../../hub.js"
import {Tracer} from "../../schema/hybrids/tracer/tracer.js"
import {Character} from "../../schema/hybrids/character/character.js"

export const melee_tracers = system("melee tracers", [

	// behavior("tracer")
	// 	.select({Character, Melee, Tracer})
	// 	.act(({realm: {physics}}) => ({character, melee, tracer}) => {
	// 		const {swordbase, swordtip} = character.helpers
	// 		const attack_is_in_progress2 = melee_action_is_offensive(melee.action)

	// 		if (melee_action_is_offensive(melee.action) && melee.action.phase) {}
	// 		const attack_is_in_progress = (
	// 			(attackage.technique !== null) &&
	// 			(attackReport({
	// 				weapon: defaultWeapon,
	// 				technique: attackage.technique,
	// 				seconds: attackage.seconds,
	// 			}).phase === Attacking.Phase.Release)
	// 		)

	// 		const {lines} = tracer.state

	// 		if (attack_is_in_progress) {
	// 			swordbase.computeWorldMatrix(true)
	// 			swordtip.computeWorldMatrix(true)
	// 			const a = babylonian.to.vec3(swordbase.absolutePosition)
	// 			const b = babylonian.to.vec3(swordtip.absolutePosition)
	// 			lines.push([a, b])
	// 			while (lines.length > 100)
	// 				lines.shift()
	// 		}

	// 		tracer.state = {lines}

	// 		if (attack_is_in_progress) {
	// 			const {details: tracingDetails} = tracer

	// 			if (tracingDetails) {
	// 				const {xyz} = vec3.to
	// 				const {xyzw} = quat.to
	// 				const noPosition = xyz(vec3.zero())
	// 				const noRotation = xyzw(quat.identity())
	// 				const hits = {
	// 					near: [] as Rapier.Collider[],
	// 					far: [] as Rapier.Collider[],
	// 				}
	// 				const nearHitCallback = (hit: Rapier.Collider): boolean => {
	// 					hits.near.push(hit)
	// 					return true
	// 				}
	// 				const farHitCallback = (hit: Rapier.Collider): boolean => {
	// 					hits.far.push(hit)
	// 					return true
	// 				}
	// 				function triangulate(...triangles: Tracing.Triangle[]) {
	// 					return triangles.map(t => new Rapier.Triangle(
	// 						xyz(t[0]),
	// 						xyz(t[1]),
	// 						xyz(t[2])),
	// 					)
	// 				}
	// 				const nearTriangles = triangulate(...tracingDetails.ribbonNearEdgeTriangles)
	// 				const farTriangles = triangulate(...tracingDetails.ribbonFarEdgeTriangles)

	// 				for (const tri of nearTriangles) {
	// 					physics.world.intersectionsWithShape(
	// 						noPosition,
	// 						noRotation,
	// 						tri,
	// 						nearHitCallback,
	// 						undefined,
	// 						physics.grouper.specify({
	// 							filter: [physics.groups.level, physics.groups.dynamic],
	// 							membership: [physics.groups.sensor],
	// 						}),
	// 					)
	// 				}

	// 				for (const tri of farTriangles) {
	// 					physics.world.intersectionsWithShape(
	// 						noPosition,
	// 						noRotation,
	// 						tri,
	// 						farHitCallback,
	// 						undefined,
	// 						physics.grouper.specify({
	// 							filter: [physics.groups.dynamic],
	// 							membership: [physics.groups.sensor],
	// 						}),
	// 					)
	// 				}

	// 				const [hit] = [...hits.near, ...hits.far]

	// 				if (hit) {
	// 					const dynamic = physics.dynamics.get(hit)
	// 					if (dynamic && tracingDetails.direction) {
	// 						dynamic.rigid.applyImpulseAtPoint(
	// 							vec3.to.xyz(vec3.multiplyBy(tracingDetails.direction, 1_000)),
	// 							dynamic.rigid.translation(),
	// 							true,
	// 						)
	// 					}
	// 					attackage.technique = null
	// 				}
	// 			}
	// 		}
	// 	}),

])
