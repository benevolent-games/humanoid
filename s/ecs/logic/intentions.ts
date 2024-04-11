
import {cap_vector_to_magnitude_1, get_trajectory_from_cardinals, scalar, vec2} from "@benev/toolbox"

import {behavior, system} from "../hub.js"
import {MouseAccumulator} from "../components/hybrids/mouse_accumulator.js"
import {Controllable, Intent, Stance} from "../components/plain_components.js"
import {LookpadAccumulator} from "../components/hybrids/lookpad_accumulator.js"

export const intentions = system("intentions", ({realm}) => [
	behavior("wipe intent")
		.select({Controllable, Intent})
		.logic(() => ({components}) => {
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
		.logic(() => ({components: c}) => {
			const [x, y] = c.mouseAccumulator.movement.steal()
			const sens = scalar.radians.from.arcseconds(realm.ui.sensitivity.mouse)
			c.intent.glance = vec2.add(
				c.intent.glance,
				realm.stage.pointerLocker.locked
					? vec2.multiplyBy([x, -y], sens)
					: vec2.zero(),
			)
		}),

	behavior("add lookpad movements to glance")
		.select({Controllable, Intent, LookpadAccumulator})
		.logic(() => ({components: c}) => {
			const [x, y] = c.lookpadAccumulator.movement.steal()
			const sens = scalar.radians.from.arcseconds(realm.ui.sensitivity.touch)
			c.intent.glance = vec2.add(
				c.intent.glance,
				vec2.multiplyBy([x, -y], sens),
			)
		}),


	behavior("add keyboard looking to glance")
		.select({Controllable, Intent})
		.logic(tick => ({components: c}) => {
			const {buttons} = realm.tact.inputs.humanoid
			const [x, y] = get_trajectory_from_cardinals({
				north: buttons.up.input.down,
				south: buttons.down.input.down,
				west: buttons.left.input.down,
				east: buttons.right.input.down,
			})
			const keySensitivity = scalar.radians.from.degrees(realm.ui.sensitivity.keys) * tick.seconds
			c.intent.glance = vec2.add(
				c.intent.glance,
				vec2.multiplyBy([-x, y], keySensitivity),
			)
		}),

	behavior("add move keys to amble")
		.select({Controllable, Intent})
		.logic(() => ({components: {intent}}) => {
			const {buttons} = realm.tact.inputs.humanoid
			const vector = get_trajectory_from_cardinals({
				north: buttons.forward.input.down,
				south: buttons.backward.input.down,
				west: buttons.leftward.input.down,
				east: buttons.rightward.input.down,
			})
			intent.amble = vec2.add(
				intent.amble,
				vector,
			)
		}),

	behavior("add move stick to amble")
		.select({Controllable, Intent})
		.logic(() => ({components: {intent}}) => {
			const {vector: [x, y]} = realm.tact.connectedDevices.stick
			intent.amble = vec2.add(intent.amble, [-x, y])
		}),

	behavior("cap amble to magnitude 1")
		.select({Intent})
		.logic(() => ({components: {intent}}) => {
			intent.amble = cap_vector_to_magnitude_1(intent.amble)
		}),

	behavior("apply fast and slow to intent")
		.select({Controllable, Intent})
		.logic(() => ({components}) => {
			const {fast, slow} = realm.tact.inputs.humanoid.buttons
			components.intent.fast = fast.input.down
			components.intent.slow = slow.input.down
		}),

	behavior("change stance")
		.select({Controllable, Intent, Stance})
		.logic(() => ({components: c}) => {
			const {crouch} = realm.tact.inputs.humanoid.buttons
			c.stance = (
				c.intent.fast ? "stand"
				: crouch.input.down ? "crouch"
				: "stand"
			)
		}),

	behavior("set jump intent")
		.select({Controllable, Intent})
		.logic(() => ({components}) => {
			const {jump} = realm.tact.inputs.humanoid.buttons
			components.intent.jump = !!jump.pressed
		}),
])

