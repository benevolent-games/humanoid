
import {Vec2, label} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {HybridComponent} from "../../hub.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"

export class GimbalRig extends HybridComponent<{}> {
	transformA = new TransformNode(
		label("transform-a"),
		this.realm.stage.scene,
		true,
	)

	transformB = new TransformNode(
		label("transform-b"),
		this.realm.stage.scene,
		true,
	)

	applyGimbal(gimbal: Vec2) {
		const quaternions = gimbaltool(gimbal).quaternions()
		this.transformB.rotationQuaternion = quaternions.vertical
		this.transformA.rotationQuaternion = quaternions.horizontal
	}

	created() {
		this.transformB.setParent(this.transformA)
	}

	updated() {}

	deleted() {
		this.transformB.dispose()
		this.transformA.dispose()
	}
}

