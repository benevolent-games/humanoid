

import {label} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {HybridComponent} from "../../hub.js"

export class Transform extends HybridComponent<{}> {
	node = new TransformNode(label("node"), this.realm.stage.scene)

	created() {}
	updated() {}
	deleted() {
		this.node.dispose()
	}
}

