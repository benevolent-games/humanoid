
import {labeler} from "@benev/toolbox"
import {HybridComponent} from "@benev/toolbox/x/ecs/ecs5.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class Spectator extends HybridComponent<HumanoidRealm, {}> {
	label = labeler("spectator")

	transformA = new TransformNode(
		this.label("transform-a"),
		this.realm.stage.scene,
		true,
	)

	transformB = new TransformNode(
		this.label("transform-b"),
		this.realm.stage.scene,
		true,
	)

	init() {}
	deleted() {
		this.transformA.dispose()
		this.transformB.dispose()
	}
}

