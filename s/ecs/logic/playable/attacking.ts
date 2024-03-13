
import {babylonian, human} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {Tracer} from "../../schema/hybrids/tracer.js"
import {Attackage, Intent} from "../../schema/schema.js"
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

			swordbase.computeWorldMatrix(true)
			swordtip.computeWorldMatrix(true)

			const a = babylonian.to.vec3(swordbase.absolutePosition)
			const b = babylonian.to.vec3(swordtip.absolutePosition)

			if (attackage.attack > 0) {
				attackage.line_memory.push([a, b])
				while (attackage.line_memory.length > 100)
					attackage.line_memory.shift()
			}

			tracer.state = {lines: attackage.line_memory}

			// swordproxy.computeWorldMatrix(true)
			// box.bond.position = babylonian.to.vec3(swordproxy.absolutePosition)
			// box.bond.rotation = babylonian.ascertain.absoluteQuat(swordproxy)

			// for (const event of physics.collision_events) {
			// 	const isMatch = event.started && (
			// 		box.collider.handle === event.a ||
			// 		box.collider.handle === event.b
			// 	)
			// 	if (isMatch)
			// 		console.log("collision", event)
			// }

			// physics.world.intersectionsWithShape(
			// 	box.collider.translation(),
			// 	box.collider.rotation(),
			// 	box.collider.shape,
			// 	hit => {
			// 		console.log("level intersection", hit)
			// 		return true
			// 	},
			// 	undefined,
			// 	physics.grouper.specify({
			// 		filter: [physics.groups.level],
			// 		membership: [physics.groups.sensor],
			// 	}),
			// )
		}),
])

