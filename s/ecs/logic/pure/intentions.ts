
import {behavior, system} from "../../hub.js"
import {Controllable, Intent, Stance} from "../../schema/schema.js"
import {MouseAccumulator} from "../../schema/hybrids/mouse_accumulator.js"
import {get_trajectory_from_cardinals, scalar, vec2} from "@benev/toolbox"

export const intentions = system("intentions", [
	behavior("wipe intent")
		.select({Controllable, Intent})
		.logic(() => () => ({components}) => {
			components.intent = {
				glance: vec2.zero(),
				amble: vec2.zero(),
				fast: false,
				slow: false,
				jump: false,
			}
		}),

	behavior("add mouse movements to glance")
		.select({Controllable, Intent, MouseAccumulator})
		.logic(({realm}) => () => ({components: c}) => {
			const [x, y] = c.mouseAccumulator.movement.steal()
			const mouseSensitivity = scalar.radians.from.arcseconds(realm.sensitivity.mouse)
			c.intent.glance = vec2.add(
				c.intent.glance,
				realm.stage.pointerLocker.locked
					? vec2.multiplyBy([x, -y], mouseSensitivity)
					: vec2.zero(),
			)
		}),

	behavior("add keyboard looking to glance")
		.select({Controllable, Intent})
		.logic(({realm}) => tick => ({components: c}) => {
			const {buttons} = realm.tact.inputs.humanoid
			const [x, y] = get_trajectory_from_cardinals({
				north: buttons.up.input.down,
				south: buttons.down.input.down,
				west: buttons.left.input.down,
				east: buttons.right.input.down,
			})
			const keySensitivity = scalar.radians.from.degrees(realm.sensitivity.keys) * tick.seconds
			c.intent.glance = vec2.add(
				c.intent.glance,
				vec2.multiplyBy([-x, y], keySensitivity),
			)
		}),

	behavior("add move keys to amble")
		.select({Controllable, Intent})
		.logic(({realm}) => () => ({components: c}) => {
			const {buttons} = realm.tact.inputs.humanoid
			const vector = get_trajectory_from_cardinals({
				north: buttons.forward.input.down,
				south: buttons.backward.input.down,
				west: buttons.leftward.input.down,
				east: buttons.rightward.input.down,
			})
			c.intent.amble = vec2.add(
				c.intent.amble,
				vector,
			)
		}),

	behavior("apply fast and slow to intent")
		.select({Controllable, Intent})
		.logic(({realm}) => () => ({components}) => {
			const {fast, slow} = realm.tact.inputs.humanoid.buttons
			components.intent.fast = fast.input.down
			components.intent.slow = slow.input.down
		}),

	behavior("change stance")
		.select({Controllable, Intent, Stance})
		.logic(({realm}) => () => ({components: c}) => {
			const {crouch} = realm.tact.inputs.humanoid.buttons
			c.stance = (
				c.intent.fast ? "stand"
				: crouch.input.down ? "crouch"
				: "stand"
			)
		}),

	behavior("set jump intent")
		.select({Controllable, Intent})
		.logic(({realm}) => () => ({components}) => {
			const {down, repeat} = realm.tact.inputs.humanoid.buttons.jump.input
			components.intent.jump = down && !repeat
		}),
])

