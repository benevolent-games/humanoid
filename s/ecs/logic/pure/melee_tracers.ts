
import {Rapier, babylonian, quat, vec3} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {MeleeAction} from "../../schema/schema.js"
import {Melee} from "../../../models/attacking/melee.js"
import {Tracer} from "../../schema/hybrids/tracer/tracer.js"
import {Tracing} from "../../schema/hybrids/tracer/parts/types.js"
import {Character} from "../../schema/hybrids/character/character.js"

export const melee_tracers = system("melee tracers", [

	behavior("tracer")
		.select({Character, Tracer, MeleeAction})
		.act(({realm: {physics}}) => components => {
			const {character, meleeAction, tracer} = components
			const {swordbase, swordtip} = character.helpers
			const attack_is_in_windup_phase = (
				Melee.Action.isAttack(meleeAction) &&
				meleeAction.report.phase === Melee.Phase.Windup
			)
			const attack_is_in_release_phase = (
				Melee.Action.isAttack(meleeAction) &&
				meleeAction.report.phase === Melee.Phase.Release
			)

			if (attack_is_in_windup_phase)
				tracer.state.lines = []

			const {lines} = tracer.state

			if (attack_is_in_release_phase) {
				swordbase.computeWorldMatrix(true)
				swordtip.computeWorldMatrix(true)
				const a = babylonian.to.vec3(swordbase.absolutePosition)
				const b = babylonian.to.vec3(swordtip.absolutePosition)
				lines.push([a, b])
				while (lines.length > 100)
					lines.shift()
			}

			tracer.state = {lines}

			if (attack_is_in_release_phase) {
				const {details: tracingDetails} = tracer

				if (tracingDetails) {
					const {xyz} = vec3.to
					const {xyzw} = quat.to
					const noPosition = xyz(vec3.zero())
					const noRotation = xyzw(quat.identity())
					const hits = {
						near: [] as Rapier.Collider[],
						far: [] as Rapier.Collider[],
					}
					const nearHitCallback = (hit: Rapier.Collider): boolean => {
						hits.near.push(hit)
						return true
					}
					const farHitCallback = (hit: Rapier.Collider): boolean => {
						hits.far.push(hit)
						return true
					}
					function triangulate(...triangles: Tracing.Triangle[]) {
						return triangles.map(t => new Rapier.Triangle(
							xyz(t[0]),
							xyz(t[1]),
							xyz(t[2])),
						)
					}
					const nearTriangles = triangulate(...tracingDetails.ribbonNearEdgeTriangles)
					const farTriangles = triangulate(...tracingDetails.ribbonFarEdgeTriangles)

					for (const tri of nearTriangles) {
						physics.world.intersectionsWithShape(
							noPosition,
							noRotation,
							tri,
							nearHitCallback,
							undefined,
							physics.grouper.specify({
								filter: [physics.groups.level, physics.groups.dynamic],
								membership: [physics.groups.sensor],
							}),
						)
					}

					for (const tri of farTriangles) {
						physics.world.intersectionsWithShape(
							noPosition,
							noRotation,
							tri,
							farHitCallback,
							undefined,
							physics.grouper.specify({
								filter: [physics.groups.dynamic],
								membership: [physics.groups.sensor],
							}),
						)
					}

					const [hit] = [...hits.near, ...hits.far]

					if (hit) {
						const dynamic = physics.dynamics.get(hit)
						if (dynamic && tracingDetails.direction) {
							dynamic.rigid.applyImpulseAtPoint(
								vec3.to.xyz(vec3.multiplyBy(tracingDetails.direction, 1_000)),
								dynamic.rigid.translation(),
								true,
							)
						}
						meleeAction.earlyRecovery = meleeAction.seconds
					}
				}
			}
		}),

])
