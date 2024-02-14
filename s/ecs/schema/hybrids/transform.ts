

import {labeler} from "@benev/toolbox"
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {HybridComponent} from "@benev/toolbox/x/ecs/ecs5.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class Transform extends HybridComponent<HumanoidRealm, {}> {
	label = labeler("transform")
	node = new TransformNode(labeler("transform")("node"), this.realm.stage.scene)

	init() {}

	deleted() {
		this.node.dispose()
	}
}

