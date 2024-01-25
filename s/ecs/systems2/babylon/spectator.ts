
import {Vector3} from "@babylonjs/core/Maths/math.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {behavior} from "../../hub.js"
import {flatten} from "../utils/flatten.js"
import {gimbaltool} from "../utils/gimbaltool.js"
import {Vec2, Vec3, babylonian, scalar, vec3} from "@benev/toolbox"

export const spectator = behavior("spectator")
	.select(
		"spectator",
		"force",
		"gimbal",
		"position",
		"speeds",
		"camera",
	)
	.lifecycle(realm => (state, id) => {

	const {stage} = realm
	const name = (n: string) => `${n}::${id}`

	const transformA = new TransformNode(name("transform-a"), stage.scene, true)
	const transformB = new TransformNode(name("transform-b"), stage.scene, true)
	const camera = new TargetCamera(name("camera"), Vector3.Zero())

	camera.fov = scalar.radians.from.degrees(state.camera.fov)
	camera.minZ = state.camera.minZ
	camera.maxZ = state.camera.maxZ
	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	transformA.position.set(...state.position)

	stage.rendering.setCamera(camera)

	function apply_3d_rotation_to_movement(
			position: Vec3,
			move: Vec2,
		) {

		const [x, z] = move
		const translation = new Vector3(x, 0, z)

		const translation_considering_rotation = translation
			.applyRotationQuaternion(transformB.absoluteRotationQuaternion)

		return vec3.add(
			position,
			babylonian.to.vec3(translation_considering_rotation),
		)
	}

	return {
		tick(_tick, state) {
			const {force} = state
			const quaternions = gimbaltool(state.gimbal).quaternions()

			state.position = (
				apply_3d_rotation_to_movement(
					state.position,
					flatten(force),
				)
			)

			transformA.position.set(...state.position)
			transformB.rotationQuaternion = quaternions.vertical
			transformA.rotationQuaternion = quaternions.horizontal
		},
		end() {
			if (stage.rendering.camera === camera)
				stage.rendering.setCamera(null)
			camera.dispose()
			transformA.dispose()
		},
	}
})

