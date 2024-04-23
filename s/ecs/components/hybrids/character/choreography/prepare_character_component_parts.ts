
import {Scene} from "@babylonjs/core/scene.js"
import {babyloid, label, quat, vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {ContainerInstance} from "../../../../../models/glb/container_instance.js"

export function prepare_character_component_parts(
		scene: Scene,
		character: ContainerInstance,
		height: number,
	) {

	const transform = new TransformNode(label("choreographyTransform"), scene)
	character.position = [0, -(height / 2), 0]
	character.root.setParent(transform)

	const position
		= transform.position
		= babyloid.from.vec3(vec3.zero())

	const rotation
		= transform.rotationQuaternion
		= babyloid.from.quat(quat.identity())

	return {
		transform,
		character,
		position,
		rotation,
		dispose() {
			character.dispose()
			transform.dispose()
		},
	}
}

