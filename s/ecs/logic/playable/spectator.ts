
import {vec3} from "@benev/toolbox"
import {behavior, system} from "../../hub.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"
import {Spectator} from "../../schema/hybrids/spectator.js"
import {flatten, unflatten} from "../../../tools/flatten.js"
import {Force, Gimbal, Impetus, Intent, Position, Speeds} from "../../schema/schema.js"
import {apply_3d_rotation_to_movement} from "./simulation/apply_3d_rotation_to_movement.js"

export const spectator = system("spectator", [
	behavior("set gimbal quaternions")
		.select({Spectator, Gimbal})
		.act(() => c => {
			const {transformA, transformB} = c.spectator
			const quaternions = gimbaltool(c.gimbal).quaternions()
			transformB.rotationQuaternion = quaternions.vertical
			transformA.rotationQuaternion = quaternions.horizontal
		}),

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
		.select({Spectator, Impetus, Position})
		.act(() => c => {
			const {transformA, transformB} = c.spectator
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
		.select({Spectator, Position})
		.act(() => c => {
			const {transformA} = c.spectator
			transformA.position.set(...c.position)
		}),
])

