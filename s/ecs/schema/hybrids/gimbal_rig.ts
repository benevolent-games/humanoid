
import {HybridComponent, Vec2, label} from "@benev/toolbox"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {gimbaltool} from "../../../tools/gimbaltool.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class GimbalRig extends HybridComponent<HumanoidRealm, {}> {
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

