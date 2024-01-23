
import {Disposable, Vec3, babylonian} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {AssetContainer, InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

import {animation_association} from "./utils/animation_association.js"

export class CharacterInstance extends Disposable {
	root: TransformNode
	instanced: InstantiatedEntries

	constructor(container: AssetContainer) {
		super()

		const instanced = container.instantiateModelsToScene()
		this.instanced = instanced

		const [__root__] = instanced.rootNodes
		const root = __root__.getChildren()[0] as TransformNode
		this.root = root

		this.disposable(() => instanced.dispose())
	}

	get position() {
		return babylonian.to.vec3(this.root.position)
	}

	set position(v: Vec3) {
		this.root.position.set(...v)
	}

	get_animation_group(name: string) {
		const {animationGroups} = this.instanced
		return animation_association.recover(animationGroups, name)
	}
}

