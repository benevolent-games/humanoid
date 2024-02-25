

import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {HybridComponent, Vec2, Vec3, babylonian, label, scalar} from "@benev/toolbox"

import {gimbaltool} from "../../../tools/gimbaltool.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

export class HumanoidCameraRig extends HybridComponent<HumanoidRealm, {
		height: number
		third_person_distance: number
	}> {

	#disposables = new Set<() => void>()

	readonly parts = (() => {
		const {state, realm} = this
		const {scene} = realm.stage
		const {colors} = realm

		const transform = new TransformNode(label("transform"), scene)

		const torusDiameter = state.height - 0.3
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

		this.#disposables
			.add(() => headbox.dispose())
			.add(() => torus.dispose())
			.add(() => torusRoot.dispose())
			.add(() => transform.dispose())

		return {transform, torusRoot, torus, headbox}
	})()

	applyGimbal(gimbal: Vec2) {
		const {transform, torusRoot} = this.parts
		const quaternions = gimbaltool(gimbal).quaternions()
		transform.rotationQuaternion = quaternions.horizontal
		torusRoot.rotationQuaternion = quaternions.vertical
	}

	setDebug(d: boolean) {
		const {torus, headbox} = this.parts
		torus.setEnabled(d)
		headbox.setEnabled(d)
	}

	get position() {
		return babylonian.to.vec3(this.parts.transform.position)
	}

	set position(p: Vec3) {
		this.parts.transform.position.set(...p)
	}

	created() {}
	updated() {}
	deleted() {
		this.#disposables.forEach(d => d())
	}
}

