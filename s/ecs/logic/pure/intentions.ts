
import {behavior, system} from "../../hub.js"
import {invert_y_axis} from "../../../tools/invert_y_axis.js"
import {get_trajectory_from_cardinals, vec2} from "@benev/toolbox"
import {MouseAccumulator} from "../../schema/hybrids/mouse_accumulator.js"
import {Controllable, Intent, Sensitivity, Stance} from "../../schema/schema.js"

export const intentions = system("intentions", [
	behavior("wipe intent")
		.select({Controllable, Intent})
		.act(() => c => {
			c.intent = {
				glance: vec2.zero(),
				amble: vec2.zero(),
				fast: false,
				slow: false,
				jump: false,
				attack: false,
			}
		}),

	behavior("set attack button status")
		.select({Controllable, Intent})
		.act(({realm}) => c => {
			const {buttons} = realm.impulse.report.humanoid
			c.intent.attack = buttons.attack.down && !buttons.attack.repeat
		}),

	behavior("add mouse movements to glance")
		.select({Controllable, Intent, MouseAccumulator, Sensitivity})
		.act(({realm}) => c => {
			const mouselook = c.mouseAccumulator.movement.steal()
			c.intent.glance = vec2.add(
				c.intent.glance,
				realm.stage.pointerLocker.locked
					? vec2.multiplyBy(invert_y_axis(mouselook), c.sensitivity.mouse)
					: vec2.zero(),
			)
		}),

	behavior("add keyboard looking to glance")
		.select({Controllable, Intent, Sensitivity})
		.act(({realm}) => c => {
			const {buttons} = realm.impulse.report.humanoid
			const keylook = get_trajectory_from_cardinals({
				north: buttons.up.down,
				south: buttons.down.down,
				west: buttons.left.down,
				east: buttons.right.down,
			})
			c.intent.glance = vec2.add(
				c.intent.glance,
				vec2.multiplyBy(keylook, c.sensitivity.keys),
			)
		}),

	behavior("add move keys to amble")
		.select({Controllable, Intent})
		.act(({realm}) => c => {
			const {buttons} = realm.impulse.report.humanoid
			const vector = get_trajectory_from_cardinals({
				north: buttons.forward.down,
				south: buttons.backward.down,
				west: buttons.leftward.down,
				east: buttons.rightward.down,
			})
			c.intent.amble = vec2.add(
				c.intent.amble,
				vector,
			)
		}),

	behavior("apply fast and slow to intent")
		.select({Controllable, Intent})
		.act(({realm}) => c => {
			const {fast, slow} = realm.impulse.report.humanoid.buttons
			c.intent.fast = fast.down
			c.intent.slow = slow.down
		}),

	behavior("change stance")
		.select({Controllable, Intent, Stance})
		.act(({realm}) => c => {
			const {crouch} = realm.impulse.report.humanoid.buttons
			c.stance = (
				c.intent.fast ? "stand"
				: crouch.down ? "crouch"
				: "stand"
			)
		}),

	behavior("set jump intent")
		.select({Controllable, Intent})
		.act(({realm}) => c => {
			const {jump} = realm.impulse.report.humanoid.buttons
			c.intent.jump = jump.down && !jump.repeat
		}),
])

