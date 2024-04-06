
import {Meshoid, Quat, Vec3, babylonian} from "@benev/toolbox"
import {InstancedMesh} from "@babylonjs/core/Meshes/instancedMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
import {AssetContainer, InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

export class ContainerInstance {
	root: TransformNode
	instantiated: InstantiatedEntries

	meshes: Map<string, Meshoid>
	animationGroups: Map<string, AnimationGroup>

	constructor(public container: AssetContainer) {
		ContainerInstance.#set_original_reference_metadata([
			...container.getNodes(),
			...container.animationGroups,
		])

		this.instantiated = container.instantiateModelsToScene()
		const [__root__] = this.instantiated.rootNodes
		this.root = __root__.getChildren()[0] as TransformNode

		this.meshes = ContainerInstance.#recover_names_for_meshes(this.root.getChildMeshes())
		this.animationGroups = ContainerInstance.#recover_names(this.instantiated.animationGroups)
	}

	get position() { return babylonian.to.vec3(this.root.position) }
	set position(v: Vec3) { this.root.position.set(...v) }

	get rotation() { return babylonian.ascertain.quat(this.root) }
	set rotation(q: Quat) { this.root.rotationQuaternion = babylonian.from.quat(q) }

	dispose() {
		this.instantiated.dispose()
	}

	static #set_original_reference_metadata(items: {metadata: any}[]) {
		for (const item of items)
			item.metadata = {...(item.metadata ?? {}), original: item}
	}

	static #recover_names<T extends {metadata: any}>(items: T[]) {
		return new Map<string, T>(
			items.map(item => [item.metadata.original.name, item])
		)
	}

	static #recover_names_for_meshes<T extends Meshoid>(mesh: T[]) {
		return new Map<string, T>(
			mesh.map(mesh => [
				(mesh instanceof InstancedMesh
					? mesh.sourceMesh
					: mesh
				).metadata.original.name,
				mesh,
			])
		)
	}
}

