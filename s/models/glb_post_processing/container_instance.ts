
import {Meshoid, Quat, Vec3, babylonian} from "@benev/toolbox"

import {AbstractMesh} from "@babylonjs/core/Meshes/abstractMesh.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
import {AssetContainer, InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

export class ContainerInstance {
	root: TransformNode
	instantiated: InstantiatedEntries

	meshes = new Map<string, Meshoid>()
	animationGroups = new Map<string, AnimationGroup>()

	constructor(public container: AssetContainer) {
		this.instantiated = container.instantiateModelsToScene(name => name)
		const [__root__] = this.instantiated.rootNodes
		this.root = __root__.getChildren()[0] as TransformNode

		this.root.getChildren(node => node instanceof AbstractMesh, false)
			.map(node => node as Meshoid)
			.forEach(mesh => this.meshes.set(mesh.name, mesh))

		this.instantiated.animationGroups
			.forEach(group => this.animationGroups.set(group.name, group))
	}

	get position() { return babylonian.to.vec3(this.root.position) }
	set position(v: Vec3) { this.root.position.set(...v) }

	get rotation() { return babylonian.ascertain.quat(this.root) }
	set rotation(q: Quat) { this.root.rotationQuaternion = babylonian.from.quat(q) }

	dispose() {
		this.instantiated.dispose()
	}
}

