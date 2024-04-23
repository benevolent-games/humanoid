
import {Meshoid, Prop, Quat, Vec3, babyloid} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"
import {AssetContainer, InstantiatedEntries} from "@babylonjs/core/assetContainer.js"

export class ContainerInstance {
	readonly root: TransformNode
	readonly instantiated: InstantiatedEntries

	readonly props = new Map<string, Prop>()
	readonly meshes = new Map<string, Meshoid>()
	readonly topLevelProps = new Map<string, Prop>()
	readonly animationGroups = new Map<string, AnimationGroup>()

	constructor(public container: AssetContainer) {
		this.instantiated = container.instantiateModelsToScene(name => name)
		const [__root__] = this.instantiated.rootNodes
		this.root = __root__.getChildren()[0] as TransformNode

		// top level props
		this.root
			.getChildren(babyloid.is.prop, true)
			.forEach(prop => this.topLevelProps.set(prop.name, prop))

		// props
		this.root
			.getChildren(babyloid.is.prop, false)
			.forEach(prop => this.props.set(prop.name, prop))

		// meshes
		this.root
			.getChildren(babyloid.is.meshoid, false)
			.forEach(mesh => this.meshes.set(mesh.name, mesh))

		// animation groups
		this.instantiated.animationGroups
			.forEach(group => this.animationGroups.set(group.name, group))
	}

	get position() { return babyloid.to.vec3(this.root.position) }
	set position(v: Vec3) { this.root.position.set(...v) }

	get rotation() { return babyloid.ascertain.quat(this.root) }
	set rotation(q: Quat) { this.root.rotationQuaternion = babyloid.from.quat(q) }

	dispose() {
		this.instantiated.dispose()
	}
}

