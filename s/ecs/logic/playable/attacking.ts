
import {Rapier, babylonian, quat, vec3} from "@benev/toolbox"

import {behavior, system} from "../../hub.js"
import {Attackage, Intent} from "../../schema/schema.js"
import {Tracer} from "../../schema/hybrids/tracer/tracer.js"
import {Tracing} from "../../schema/hybrids/tracer/parts/types.js"
import {Character} from "../../schema/hybrids/character/character.js"
import {AttackPhase, attack_report} from "../../schema/hybrids/character/attacking/attacks.js"

export const attacking = system("attacking", [

	behavior("initiate attack")
		.select({Attackage, Intent})
		.act(() => state => {
			if (state.intent.attack && state.attackage.attack === 0) {
				state.attackage.attack = 3
				state.attackage.seconds = 0
				state.attackage.line_memory = []
			}
		}),

	behavior("sustain attack")
		.select({Attackage})
		.act(({tick}) => state => {
			state.attackage.seconds += tick.seconds
		}),

	behavior("end attack")
		.select({Attackage})
		.act(() => state => {
			if (state.attackage.attack !== 0) {
				const report = attack_report(state.attackage.seconds)
				if (report.phase === AttackPhase.None)
					state.attackage.attack = 0
			}
		}),

	behavior("tracer")
		.select({Attackage, Character, Tracer})
		.act(({realm: {physics}}) => ({attackage, character, tracer}) => {
			const {swordbase, swordtip} = character.helpers
			const attack_is_in_progress = (
				attackage.attack > 0 &&
				attack_report(attackage.seconds).phase === AttackPhase.Release
			)

			if (attack_is_in_progress) {
				swordbase.computeWorldMatrix(true)
				swordtip.computeWorldMatrix(true)
				const a = babylonian.to.vec3(swordbase.absolutePosition)
				const b = babylonian.to.vec3(swordtip.absolutePosition)
				attackage.line_memory.push([a, b])
				while (attackage.line_memory.length > 100)
					attackage.line_memory.shift()
			}

			tracer.state = {lines: attackage.line_memory}

			if (attack_is_in_progress) {
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
						attackage.attack = 0
					}
				}
			}
		}),
])

