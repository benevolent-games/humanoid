
import {behavior, system} from "../../hub.js"
import {Vec2, get_trajectory_from_cardinals, vec2} from "@benev/toolbox"

export const intentions = system("intentions", () => [

	behavior("apply intent.glance based on mouse and key inputs")
		.select("intent", "sensitivity")
		.lifecycle(realm => () => {
			const {impulse, stage} = realm
			const {buttons} = impulse.report.humanoid
			const mouseMovement = impulse.devices.mouse.make_accumulator()
			const invert_y_axis = (v: Vec2) => vec2.multiply(v, [1, -1])
			return {
				tick(_, state) {
					const mouselook = invert_y_axis(mouseMovement.steal())
					const keylook = get_trajectory_from_cardinals({
						north: buttons.up,
						south: buttons.down,
						west: buttons.left,
						east: buttons.right,
					})
					state.intent.glance = vec2.add(
						vec2.multiplyBy(keylook, state.sensitivity.keys),
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

	behavior("apply intent.amble based on key inputs")
		.select("intent")
		.processor(realm => () => state => {
			const {buttons} = realm.impulse.report.humanoid
			const [x, z] = get_trajectory_from_cardinals({
				north: buttons.forward,
				south: buttons.backward,
				west: buttons.leftward,
				east: buttons.rightward,
			})
			let y = buttons.jump ? 1
				: buttons.crouch ? -1
				: 0
			state.intent.amble = [x, y, z]
		}),

	behavior("apply fast and slow to intent")
		.select("intent")
		.processor(realm => () => state => {
			const {fast, slow} = realm.impulse.report.humanoid.buttons
			state.intent.fast = fast
			state.intent.slow = slow
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
			state.jump.button = buttons.jump
		}),
])

