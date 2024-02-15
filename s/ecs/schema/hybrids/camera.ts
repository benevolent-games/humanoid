
import {label, scalar} from "@benev/toolbox"
import {HybridComponent} from "@benev/toolbox"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Camera extends HybridComponent<HumanoidRealm, {
		fov: number
		minZ: number
		maxZ: number
	}> {

	node = new TargetCamera(label("camera"), Vector3.Zero())

	created() {
		const {node, state} = this
		node.fov = scalar.radians.from.degrees(state.fov)
		node.minZ = state.minZ
		node.maxZ = state.maxZ
		node.ignoreParentScaling = true
	}
	updated() {}
	deleted() {
		this.node.dispose()
	}
}

