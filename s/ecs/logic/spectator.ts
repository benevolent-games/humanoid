
import {vec3} from "@benev/toolbox"
import {Camera} from "../components/hybrids/camera.js"
import {behavior, responder, system} from "../hub.js"
import {GimbalRig} from "../components/hybrids/gimbal_rig.js"
import {flatten, unflatten} from "../../tools/flatten.js"
import {apply_3d_rotation_to_movement} from "./utils/apply_3d_rotation_to_movement.js"
import {Force, Gimbal, Impetus, Intent, Position, Spectator, Speeds} from "../components/plain_components.js"

export const spectator = system("spectator", ({realm}) => [
	responder("parenting the camera")
		.select({Spectator, Camera, GimbalRig})
		.respond(({components: c}) => {
			c.camera.node.parent = c.gimbalRig.transformB
			return () => {
				if (c.camera.node.parent === c.gimbalRig.transformB)
					c.camera.node.parent = null
			}
		}),

	responder("assign spectator camera")
		.select({Spectator, Camera})
		.respond(({components: {camera}}) => {
			realm.stage.rendering.setCamera(camera.node)
			return () => {
				if (realm.stage.rendering.camera === camera.node)
					realm.stage.rendering.setCamera(null)
			}
		}),

	behavior("calculate local force")
		.select({Spectator, Force, Intent, Speeds, Impetus})
		.logic(() => ({components}) => {
			const {force, intent, speeds} = components
			components.impetus = vec3.multiplyBy(
				unflatten(force),
				intent.fast ? speeds.fast
					: intent.slow ? speeds.slow
					: speeds.base,
			)
		}),

	behavior("apply force to position")
		.select({Spectator, GimbalRig, Impetus, Position})
		.logic(() => ({components: c}) => {
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
		.logic(() => ({components: {gimbalRig, position}}) => {
			gimbalRig.transformA.position.set(...position)
		}),

	behavior("apply gimbal to gimbalRig")
		.select({Spectator, Gimbal, GimbalRig, Position})
		.logic(() => ({components: {gimbalRig, gimbal}}) => {
			gimbalRig.applyGimbal(gimbal)
		}),
])

