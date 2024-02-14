
import {Vec3, labeler, scalar} from "@benev/toolbox"
import {Vector3} from "@babylonjs/core/Maths/math.vector.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

import {HumanoidSchema} from "../../../schema.js"
import {HumanoidRealm} from "../../../../models/realm/realm.js"

export function create_spectator_babylon_parts(realm: HumanoidRealm, init: {
		position: Vec3
		camera: HumanoidSchema["camera"]
	}) {

	const {stage} = realm
	const label = labeler("spectator")

	const transformA = new TransformNode(label("transform-a"), stage.scene, true)
	const transformB = new TransformNode(label("transform-b"), stage.scene, true)
	const camera = new TargetCamera(label("camera"), Vector3.Zero())

	camera.fov = scalar.radians.from.degrees(init.camera.fov)
	camera.minZ = init.camera.minZ
	camera.maxZ = init.camera.maxZ
	camera.ignoreParentScaling = true
	camera.parent = transformB
	transformB.parent = transformA

	transformA.position.set(...init.position)

	stage.rendering.setCamera(camera)

	const dispose = () => {
		transformB.dispose()
		transformA.dispose()

		if (realm.stage.rendering.camera === camera)
			realm.stage.rendering.setCamera(null)
		camera.dispose()
	}

	return {transformA, transformB, camera, dispose}
}

