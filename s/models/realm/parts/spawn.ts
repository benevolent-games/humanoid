
import {Prop, Meshoid} from "../types.js"
import {Node} from "@babylonjs/core/node.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {CharacterContainer} from "../../character/container.js"
import {AssetContainer} from "@babylonjs/core/assetContainer.js"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export type HumanoidContainers = {
	gym: AssetContainer
	character: CharacterContainer
}

export class Spawn {
	#containers: HumanoidContainers

	constructor(containers: HumanoidContainers) {
		this.#containers = containers
		for (const light of containers.gym.lights)
			light.intensity /= 1000
	}

	gym() {
		const instanced = this.#containers.gym.instantiateModelsToScene()
		const [root] = instanced.rootNodes

		const get_top_level = true
		const get_children_recursively = false
		const filter_for_meshoids = (node: Node) => (
			node instanceof Mesh ||
			node instanceof InstancedMesh
		)
		const filter_for_instancables = (node: Node) => (
			node instanceof Mesh ||
			node instanceof InstancedMesh ||
			node instanceof TransformNode
		)

		const top_level_nodes = (
			root.getChildren(filter_for_instancables, get_top_level)
		) as Prop[]

		const all_meshes = (
			root.getChildren(filter_for_meshoids, get_children_recursively)
		) as Meshoid[]

		return {
			instanced,
			root,
			all_meshes,
			top_level_nodes,
			dispose: () => instanced.dispose(),
		}
	}

	character() {
		return this.#containers.character.instance()
	}
}

