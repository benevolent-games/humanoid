
import {Scene} from "@babylonjs/core/scene.js"
import {Meshoid, babylonian, label, quat, vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {CharacterInstance} from "../../../../../models/character/instance.js"

export function prepare_choreographer_babylon_parts(
		scene: Scene,
		character: CharacterInstance,
		height: number,
	) {

	const transform = new TransformNode(label("choreographyTransform"), scene)
	character.position = [0, -(height / 2), 0]
	character.root.setParent(transform)

	const position
		= transform.position
		= babylonian.from.vec3(vec3.zero())

	const rotation
		= transform.rotationQuaternion
		= babylonian.from.quat(quat.identity())

	const sword = character.root
		.getChildMeshes()
		.find(m => m.name.includes("longsword")) as Meshoid

	return {
		sword,
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

