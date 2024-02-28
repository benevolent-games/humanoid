

import {label} from "@benev/toolbox"
import {HybridComponent} from "@benev/toolbox"
import {HuRealm} from "../../../models/realm/realm.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export class Transform extends HybridComponent<HuRealm, {}> {
	node = new TransformNode(label("node"), this.realm.stage.scene)

	created() {}
	updated() {}
	deleted() {
		this.node.dispose()
	}
}

