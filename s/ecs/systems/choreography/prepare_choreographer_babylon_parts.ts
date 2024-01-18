
import {Scene} from "@babylonjs/core/scene.js"
import {Quat, Vec3, babylonian, label} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {CharacterContainer} from "../../../models/character/container.js"

export function prepare_choreographer_babylon_parts(o: {
		scene: Scene
		characterContainer: CharacterContainer
		state: {
			height: number
			position: Vec3
			rotation: Quat
		}
	}) {

	const {scene, characterContainer, state} = o

	const transform = new TransformNode(label("choreographyTransform"), scene)
	const character = characterContainer.instance([0, -(state.height / 2), 0])
	character.root.setParent(transform)

	const position
		= transform.position
		= babylonian.from.vec3(state.position)

	const rotation
		= transform.rotationQuaternion
		= babylonian.from.quat(state.rotation)

	return {
		transform,
		characterInstance: character,
		position,
		rotation,
		dispose() {
			character.dispose()
			transform.dispose()
		},
	}
}

