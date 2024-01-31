
import {behavior, system} from "../../hub.js"
import {Vec2, get_trajectory_from_cardinals, vec2, vec3} from "@benev/toolbox"

export const intentions = system("intentions", () => [

	behavior("wipe intent")
		.select("intent")
		.processor(() => () => state => {
			state.intent = {
				glance: vec2.zero(),
				amble: vec3.zero(),
				fast: false,
				slow: false,
			}
		}),

	behavior("add mouse movements to glance")
		.select("intent", "sensitivity")
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
		.select("intent", "sensitivity")
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
		.select("intent")
		.processor(realm => () => state => {
			const {buttons} = realm.impulse.report.humanoid
			const [x, z] = get_trajectory_from_cardinals({
				north: buttons.forward.down,
				south: buttons.backward.down,
				west: buttons.leftward.down,
				east: buttons.rightward.down,
			})
			let y = buttons.jump ? 1
				: buttons.crouch ? -1
				: 0
			state.intent.amble = vec3.add(
				state.intent.amble,
				[x, y, z],
			)
		}),

	behavior("apply fast and slow to intent")
		.select("intent")
		.processor(realm => () => state => {
			const {fast, slow} = realm.impulse.report.humanoid.buttons
			state.intent.fast = fast.down
			state.intent.slow = slow.down
		}),

	behavior("apply crouch/stand stance")
		.select("humanoid", "stance", "intent")
		.processor(realm => () => state => {
			state.stance = state.intent.fast
				? "stand"
				: realm.impulse.report.humanoid.buttons.crouch
					? "crouch"
					: "stand"
		}),

	behavior("apply jump action")
		.select("jump")
		.processor(realm => () => state => {
			const {buttons} = realm.impulse.report.humanoid
			state.jump.button = buttons.jump.down
		}),
])

