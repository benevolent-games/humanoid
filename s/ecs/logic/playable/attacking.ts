
import {behavior, system} from "../../hub.js"
import {Attackage, Intent} from "../../schema/schema.js"
import {Character} from "../../schema/hybrids/character/character.js"
import {AttackPhase, attack_report} from "../../schema/hybrids/character/attacking/attacks.js"
import { Ray } from "../../schema/hybrids/ray.js"
import { babylonian } from "@benev/toolbox"

export const attacking = system("attacking", [

	behavior("initiate attack")
		.select({Attackage, Intent})
		.act(() => state => {
			if (state.intent.attack && state.attackage.attack === 0) {
				state.attackage.attack = 3
				state.attackage.seconds = 0
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
		.select({Attackage, Character, Ray})
		.act(({world}) => ({attackage, character, ray}) => {
			const {sword} = character.parts
			ray.a = [0, 0, 0]
			ray.b = babylonian.to.vec3(sword.absolutePosition)
			// world.createEntity({Ray}, {
			// 	ray: [
			// 		[0, 0, 0],
			// 		babylonian.to.vec3(sword.absolutePosition),
			// 	],
			// })
		}),

	// behavior("cleanup tracers")
	// 	.select({Ray})
	// 	.act(({world}) => ({ray}) => {
	// 		world.createEntity({Ray}, {
	// 			ray: [
	// 				[0, 0, 0],
	// 				babylonian.to.vec3(sword.absolutePosition),
	// 			],
	// 		})
	// 	}),

])

