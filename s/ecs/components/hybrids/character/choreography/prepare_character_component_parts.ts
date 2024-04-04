
import {Scene} from "@babylonjs/core/scene.js"
import {Meshoid, babylonian, label, quat, vec3} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {CharacterInstance} from "../../../../../models/character/instance.js"

export function prepare_character_component_parts(
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

	const meshes = character.root.getChildMeshes()
	const sword = meshes.find(m => m.name.includes("longsword")) as Meshoid

	const plz_disable = [
		"shield",
		"hatchet",
		"reference_weapon",
	]

	for (const mesh of meshes) {
		if (plz_disable.some(keyword => mesh.name.includes(keyword)))
			mesh.dispose()
	}

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

