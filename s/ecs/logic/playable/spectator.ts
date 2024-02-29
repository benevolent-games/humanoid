
import {vec3} from "@benev/toolbox"
import {Camera} from "../../schema/hybrids/camera.js"
import {behavior, responder, system} from "../../hub.js"
import {GimbalRig} from "../../schema/hybrids/gimbal_rig.js"
import {flatten, unflatten} from "../../../tools/flatten.js"
import {apply_3d_rotation_to_movement} from "./simulation/apply_3d_rotation_to_movement.js"
import {Force, Gimbal, Impetus, Intent, Position, Spectator, Speeds} from "../../schema/schema.js"

export const spectator = system("spectator", [
	responder("parenting the camera")
		.select({Spectator, Camera, GimbalRig})
		.respond(() => ({
			added(c) {
				c.camera.node.parent = c.gimbalRig.transformB
			},
			removed(c) {
				if (c.camera.node.parent === c.gimbalRig.transformB)
					c.camera.node.parent = null
			},
		})),

	responder("assign spectator camera")
		.select({Spectator, Camera})
		.respond(({realm}) => ({
			added(c) {
				realm.stage.rendering.setCamera(c.camera.node)
			},
			removed() {
				realm.stage.rendering.setCamera(null)
			},
		})),

	behavior("calculate local force")
		.select({Spectator, Force, Intent, Speeds, Impetus})
		.act(() => c => {
			const {force, intent, speeds} = c
			c.impetus = vec3.multiplyBy(
				unflatten(force),
				intent.fast ? speeds.fast
					: intent.slow ? speeds.slow
					: speeds.base,
			)
		}),

	behavior("apply force to position")
		.select({Spectator, GimbalRig, Impetus, Position})
		.act(() => c => {
			const {transformA, transformB} = c.gimbalRig
			c.position = (
				apply_3d_rotation_to_movement(
					transformB,
					c.position,
					flatten(c.impetus),
				)
			)
			transformA.position.set(...c.position)
		}),

	behavior("apply position to transform")
		.select({Spectator, GimbalRig, Position})
		.act(() => c => {
			c.gimbalRig.transformA.position.set(...c.position)
		}),

	behavior("apply gimbal to gimbalRig")
		.select({Spectator, Gimbal, GimbalRig, Position})
		.act(() => c => {
			c.gimbalRig.applyGimbal(c.gimbal)
		}),
])

