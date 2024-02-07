
import {behavior, system} from "../../hub.js"
import {Vec2, get_trajectory_from_cardinals, vec2} from "@benev/toolbox"

export const intentions = system("intentions", () => [

	behavior("wipe intent")
		.select("controllable", "intent")
		.processor(() => () => state => {
			state.intent = {
				glance: vec2.zero(),
				amble: vec2.zero(),
				fast: false,
				slow: false,
				jump: false,
				attack: false,
			}
		}),

	behavior("set attack button status")
		.select("controllable", "intent")
		.processor(realm => () => state => {
			const {buttons} = realm.impulse.report.humanoid
			state.intent.attack = buttons.attack.down && !buttons.attack.repeat
		}),

	behavior("add mouse movements to glance")
		.select("controllable", "intent", "sensitivity")
		.lifecycle(realm => () => {
			const {impulse, stage} = realm
			const mouseMovement = impulse.devices.mouse.make_accumulator()
			const invert_y_axis = (v: Vec2) => vec2.multiply(v, [1, -1])
			return {
				tick(_, state) {
					const mouselook = invert_y_axis(mouseMovement.steal())
					state.intent.glance = vec2.add(
						state.intent.glance,
						stage.pointerLocker.locked
							? vec2.multiplyBy(mouselook, state.sensitivity.mouse)
							: vec2.zero(),
					)
				},
				end() {
					mouseMovement.dispose()
				},
			}
		}),

	behavior("add keyboard looking to glance")
		.select("controllable", "intent", "sensitivity")
		.processor(realm => _tick => state => {
			const {buttons} = realm.impulse.report.humanoid
			const keylook = get_trajectory_from_cardinals({
				north: buttons.up.down,
				south: buttons.down.down,
				west: buttons.left.down,
				east: buttons.right.down,
			})
			state.intent.glance = vec2.add(
				state.intent.glance,
				vec2.multiplyBy(keylook, state.sensitivity.keys),
			)
		}),

	behavior("add move keys to amble")
		.select("controllable", "intent")
		.processor(realm => () => state => {
			const {buttons} = realm.impulse.report.humanoid
			const vector = get_trajectory_from_cardinals({
				north: buttons.forward.down,
				south: buttons.backward.down,
				west: buttons.leftward.down,
				east: buttons.rightward.down,
			})
			state.intent.amble = vec2.add(
				state.intent.amble,
				vector,
			)
		}),

	behavior("apply fast and slow to intent")
		.select("controllable", "intent")
		.processor(realm => () => state => {
			const {fast, slow} = realm.impulse.report.humanoid.buttons
			state.intent.fast = fast.down
			state.intent.slow = slow.down
		}),

	behavior("change stance")
		.select("controllable", "intent", "stance")
		.processor(realm => () => state => {
			const {crouch} = realm.impulse.report.humanoid.buttons
			state.stance = (
				state.intent.fast ? "stand"
				: crouch.down ? "crouch"
				: "stand"
			)
		}),

	behavior("set jump intent")
		.select("controllable", "intent")
		.processor(realm => () => state => {
			const {jump} = realm.impulse.report.humanoid.buttons
			state.intent.jump = jump.down && !jump.repeat
		}),
])

