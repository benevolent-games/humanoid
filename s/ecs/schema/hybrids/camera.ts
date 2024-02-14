
import {labeler, scalar} from "@benev/toolbox"
import {HybridComponent} from "@benev/toolbox/x/ecs/ecs5.js"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"

import {HumanoidRealm} from "../../../models/realm/realm.js"

export class Camera extends HybridComponent<HumanoidRealm, {
		fov: number
		minZ: number
		maxZ: number
	}> {

	label = labeler("camera")
	camera = new TargetCamera(this.label("camera"), Vector3.Zero())

	init() {
		const {camera, state} = this
		camera.fov = scalar.radians.from.degrees(state.fov)
		camera.minZ = state.minZ
		camera.maxZ = state.maxZ
		camera.ignoreParentScaling = true
	}

	deleted() {
		this.camera.dispose()
	}
}

