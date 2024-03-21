
// import {Rapier, babylonian, quat, vec3} from "@benev/toolbox"

// import {behavior, system} from "../../hub.js"
// import {Tracer} from "../../schema/hybrids/tracer/tracer.js"
// import {Attacking} from "../../../models/attacking/types.js"
// import {attackReport} from "../../../models/attacking/report.js"
// import {Tracing} from "../../schema/hybrids/tracer/parts/types.js"
// import {defaultWeapon} from "../../../models/attacking/weapons.js"
// import {Character} from "../../schema/hybrids/character/character.js"
// import {Attack, AttackWeights, CombatIntent} from "../../schema/schema.js"

// export const attacking = system("attacking", [

// 	// behavior("initiate attack")
// 	// 	.select({CombatIntent})
// 	// 	.act(() => ({combatIntent}, entity) => {
// 	// 		if (combatIntent.attack && entity.has({Attack})) {
// 	// 			entity.components.attack
// 	// 		}
// 	// 		if (intent.attack && attackage.technique === null) {
// 	// 			attackage.technique = 2
// 	// 			attackage.seconds = 0
// 	// 			tracer.state.lines = []
// 	// 		}
// 	// 	}),

// 	// behavior("sustain attack")
// 	// 	.select({Attackage})
// 	// 	.act(({tick}) => ({attackage}) => {
// 	// 		attackage.seconds += tick.seconds
// 	// 	}),

// 	// behavior("end attack")
// 	// 	.select({Attackage})
// 	// 	.act(() => ({attackage}) => {
// 	// 		if (attackage.technique !== null) {
// 	// 			const report = attackReport({
// 	// 				weapon: defaultWeapon,
// 	// 				seconds: attackage.seconds,
// 	// 				technique: attackage.technique,
// 	// 			})
// 	// 			if (report.phase === Attacking.Phase.None)
// 	// 				attackage.technique = null
// 	// 		}
// 	// 	}),

// 	// behavior("tracer")
// 	// 	.select({Attackage, Character, Tracer})
// 	// 	.act(({realm: {physics}}) => ({attackage, character, tracer}) => {
// 	// 		const {swordbase, swordtip} = character.helpers
// 	// 		const attack_is_in_progress = (
// 	// 			(attackage.technique !== null) &&
// 	// 			(attackReport({
// 	// 				weapon: defaultWeapon,
// 	// 				technique: attackage.technique,
// 	// 				seconds: attackage.seconds,
// 	// 			}).phase === Attacking.Phase.Release)
// 	// 		)

// 	// 		const {lines} = tracer.state

// 	// 		if (attack_is_in_progress) {
// 	// 			swordbase.computeWorldMatrix(true)
// 	// 			swordtip.computeWorldMatrix(true)
// 	// 			const a = babylonian.to.vec3(swordbase.absolutePosition)
// 	// 			const b = babylonian.to.vec3(swordtip.absolutePosition)
// 	// 			lines.push([a, b])
// 	// 			while (lines.length > 100)
// 	// 				lines.shift()
// 	// 		}

// 	// 		tracer.state = {lines}

// 	// 		if (attack_is_in_progress) {
// 	// 			const {details: tracingDetails} = tracer

// 	// 			if (tracingDetails) {
// 	// 				const {xyz} = vec3.to
// 	// 				const {xyzw} = quat.to
// 	// 				const noPosition = xyz(vec3.zero())
// 	// 				const noRotation = xyzw(quat.identity())
// 	// 				const hits = {
// 	// 					near: [] as Rapier.Collider[],
// 	// 					far: [] as Rapier.Collider[],
// 	// 				}
// 	// 				const nearHitCallback = (hit: Rapier.Collider): boolean => {
// 	// 					hits.near.push(hit)
// 	// 					return true
// 	// 				}
// 	// 				const farHitCallback = (hit: Rapier.Collider): boolean => {
// 	// 					hits.far.push(hit)
// 	// 					return true
// 	// 				}
// 	// 				function triangulate(...triangles: Tracing.Triangle[]) {
// 	// 					return triangles.map(t => new Rapier.Triangle(
// 	// 						xyz(t[0]),
// 	// 						xyz(t[1]),
// 	// 						xyz(t[2])),
// 	// 					)
// 	// 				}
// 	// 				const nearTriangles = triangulate(...tracingDetails.ribbonNearEdgeTriangles)
// 	// 				const farTriangles = triangulate(...tracingDetails.ribbonFarEdgeTriangles)

// 	// 				for (const tri of nearTriangles) {
// 	// 					physics.world.intersectionsWithShape(
// 	// 						noPosition,
// 	// 						noRotation,
// 	// 						tri,
// 	// 						nearHitCallback,
// 	// 						undefined,
// 	// 						physics.grouper.specify({
// 	// 							filter: [physics.groups.level, physics.groups.dynamic],
// 	// 							membership: [physics.groups.sensor],
// 	// 						}),
// 	// 					)
// 	// 				}

// 	// 				for (const tri of farTriangles) {
// 	// 					physics.world.intersectionsWithShape(
// 	// 						noPosition,
// 	// 						noRotation,
// 	// 						tri,
// 	// 						farHitCallback,
// 	// 						undefined,
// 	// 						physics.grouper.specify({
// 	// 							filter: [physics.groups.dynamic],
// 	// 							membership: [physics.groups.sensor],
// 	// 						}),
// 	// 					)
// 	// 				}

// 	// 				const [hit] = [...hits.near, ...hits.far]

// 	// 				if (hit) {
// 	// 					const dynamic = physics.dynamics.get(hit)
// 	// 					if (dynamic && tracingDetails.direction) {
// 	// 						dynamic.rigid.applyImpulseAtPoint(
// 	// 							vec3.to.xyz(vec3.multiplyBy(tracingDetails.direction, 1_000)),
// 	// 							dynamic.rigid.translation(),
// 	// 							true,
// 	// 						)
// 	// 					}
// 	// 					attackage.technique = null
// 	// 				}
// 	// 			}
// 	// 		}
// 	// 	}),
// ])

