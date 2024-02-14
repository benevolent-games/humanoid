
import {Phys, Vec3, babylonian, labeler, scalar, vec3} from "@benev/toolbox"

import {HumanoidSchema} from "../../../schema.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {HumanoidRealm} from "../../../../models/realm/realm.js"
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TargetCamera} from "@babylonjs/core/Cameras/targetCamera.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"

export type HumanoidCore = {
	transform: TransformNode
	torusRoot: TransformNode
	capsule: Phys.CharacterActor
	headbox: Mesh
	dispose: () => void
}

export type HumanoidViewable = {
	dispose: () => void
}

export type HumanoidControllable = {
	dispose: () => void
}

export function humanoid_core(realm: HumanoidRealm, init: {
		debug: boolean
		height: number
		radius: number
		position: Vec3
	}): HumanoidCore {

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
		diameter: torusDiameter,
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
	headbox.position.y = torusDiameter / 2
	headbox.material = colors.green

	const torusRoot = new TransformNode(label("torusRoot"), scene)

	// parenting
	headbox.setParent(torusRoot)
	torus.setParent(torusRoot)
	torusRoot.setParent(transform)

	// initialize capsule position
	capsule.rigid.setTranslation(vec3.to.xyz(init.position), true)
	transform.position.set(...init.position)

	disposables
		.add(() => capsule.dispose())
		.add(() => headbox.dispose())
		.add(() => torus.dispose())
		.add(() => torusRoot.dispose())
		.add(() => transform.dispose())

	const debug = !!init.debug
	capsule.mesh.setEnabled(debug)
	torus.setEnabled(debug)
	headbox.setEnabled(debug)

	return {
		torusRoot,
		transform,
		headbox,
		capsule,
		dispose() {
			for (const dispose of disposables)
				dispose()
		},
	}
}

export function humanoid_viewable(realm: HumanoidRealm, init: {
		core: HumanoidCore
		camera: HumanoidSchema["camera"]
		third_person_cam_distance: number
	}) {

	const {stage} = realm
	const {scene} = stage
	const label = labeler("humanoid")
	const {headbox} = init.core
	const disposables: (() => void)[] = []

	const position_center = babylonian.from.vec3(vec3.zero())
	const position_receded = babylonian.from.vec3([0, 0, -init.third_person_cam_distance])

	const third_person_cam = new TargetCamera(
		label("third_person_cam"),
		position_receded,
		scene,
	)
	third_person_cam.setTarget(position_center)
	third_person_cam.fov = scalar.radians.from.degrees(init.camera.fov)
	third_person_cam.minZ = init.camera.minZ
	third_person_cam.maxZ = init.camera.maxZ
	disposables.push(() => third_person_cam.dispose())

	stage.rendering.setCamera(third_person_cam)

	// parenting
	third_person_cam.parent = headbox

	return {
		dispose() {
			for (const dispose of disposables)
				dispose()
		},
	}
}

