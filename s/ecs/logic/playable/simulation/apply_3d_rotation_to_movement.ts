
import {Vec2, Vec3, babylonian, vec3} from "@benev/toolbox"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function apply_3d_rotation_to_movement(
		transformB: TransformNode,
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

