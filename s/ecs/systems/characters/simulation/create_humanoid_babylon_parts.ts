
import {Vec3, babylonian, labeler, scalar, vec3} from "@benev/toolbox"

import {HumanoidSchema} from "../../../schema.js"
import {Realm} from "../../../../models/realm/realm.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export function create_humanoid_babylon_parts(realm: Realm, init: {
		height: number
		radius: number
		third_person_cam_distance: number
		camera: HumanoidSchema["camera"]
		position: Vec3
		debug: boolean
	}) {

	const {stage, colors} = realm
	const {scene} = stage
	const label = labeler("humanoid")
	const halfHeight = (init.height - (2 * init.radius)) / 2

	const disposables = new Set<() => void>()

	const capsule = realm.physics.character({
		mass: 70,
		radius: init.radius,
		halfHeight,
		snapToGround: {
			distance: halfHeight / 2,
		},
		autostep: {
			maxHeight: halfHeight,
			minWidth: init.radius,
			includeDynamicBodies: false,
		},
		slopes: {
			minSlideAngle: scalar.radians.from.degrees(75),
			maxClimbAngle: scalar.radians.from.degrees(46),
		},
	})

	const transform = new TransformNode(label("transform"), scene)

	const torusDiameter = init.height - 0.3
	const torus = MeshBuilder.CreateTorus(label("torus"), {
		diameter: init.height - 0.3,
		thickness: 0.1,
		tessellation: 48,
	}, scene)
	torus.material = colors.red
	torus.rotationQuaternion = Quaternion.RotationAlphaBetaGamma(
		0,
		0,
		scalar.radians.from.degrees(90),
	)

	const headbox = MeshBuilder.CreateBox(
		label("box"),
		{size: 0.2},
		scene,
	)
	const third_person_cam = new TargetCamera(
		label("third_person_cam"),
		babylonian.from.vec3([0, 0, -init.third_person_cam_distance]),
		scene,
	)
	third_person_cam.setTarget(headbox.position)
	third_person_cam.fov = scalar.radians.from.degrees(init.camera.fov)
	third_person_cam.minZ = init.camera.minZ
	third_person_cam.maxZ = init.camera.maxZ
	stage.rendering.setCamera(third_person_cam)
	headbox.position.y = torusDiameter / 2
	headbox.material = colors.green

	const torusRoot = new TransformNode(label("torusRoot"), scene)

	// parenting
	third_person_cam.parent = headbox
	headbox.setParent(torusRoot)
	torus.setParent(torusRoot)
	torusRoot.setParent(transform)

	// initialize capsule position
	capsule.rigid.setTranslation(vec3.to.xyz(init.position), true)
	transform.position.set(...init.position)

	disposables
		.add(() => capsule.dispose())
		.add(() => third_person_cam.dispose())
		.add(() => headbox.dispose())
		.add(() => torus.dispose())
		.add(() => torusRoot.dispose())
		.add(() => transform.dispose())

	const debug = !!init.debug
	capsule.mesh.setEnabled(debug)
	torus.setEnabled(debug)
	headbox.setEnabled(debug)

	return {
		transform,
		torusRoot,
		capsule,
		dispose() {
			for (const dispose of disposables)
				dispose()
		},
	}
}

