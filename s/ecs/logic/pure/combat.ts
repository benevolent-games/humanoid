
import { vec2 } from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {Attack, CombatIntent, Controllable, Intent} from "../../schema/schema.js"
import { molasses2d } from "../../../tools/molasses.js"

export const combat = system("combat", [

	behavior("intent for swing, stab, and parry")
		.select({Controllable, CombatIntent})
		.act(({realm}) => c => {
			const parry = realm.tact.inputs.humanoid.buttons.parry.input
			const swing = realm.tact.inputs.humanoid.buttons.swing.input
			const stab = realm.tact.inputs.humanoid.buttons.stab.input
			c.combatIntent = {
				parry: parry.down && !parry.repeat,
				swing: swing.down && !swing.repeat,
				stab: stab.down && !stab.repeat,
				smoothedGlanceNormal: c.combatIntent.smoothedGlanceNormal,
			}
		}),

	behavior("attack")
		.select({Controllable, CombatIntent, Intent})
		.act(() => c => {
			const magnitude = vec2.magnitude(c.intent.glance)
			if (magnitude > 0) {
				const normal = vec2.normalize(c.intent.glance)
				const smoothed = molasses2d(2, c.combatIntent.smoothedGlanceNormal, normal)
				c.combatIntent.smoothedGlanceNormal = smoothed
				const glanceAngle = Math.atan2(...smoothed).toFixed(2)
				console.log(glanceAngle)
			}
		}),
])

