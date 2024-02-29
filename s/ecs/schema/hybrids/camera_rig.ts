
import {Quaternion} from "@babylonjs/core/Maths/math.vector.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {TransformNode} from "@babylonjs/core/Meshes/transformNode.js"
import {HybridComponent, Vec2, Vec3, babylonian, label, scalar} from "@benev/toolbox"

import {HuRealm} from "../../../models/realm/realm.js"
import {gimbaltool} from "../../../tools/gimbaltool.js"
import {apply_spline_to_gimbal_y} from "../../logic/playable/simulation/apply_spline_to_gimbal_y.js"

export class CameraRig extends HybridComponent<HuRealm, {
		height: number
		third_person_distance: number
	}> {

	#disposables = new Set<() => void>()

	readonly parts = (() => {
		const {state, realm} = this
		const {scene} = realm.stage
		const {colors} = realm

		const transform = new TransformNode(label("transform"), scene)

		const torusLift = 0.15
		const torusDiameter = state.height - 0.5

		const torusRoot = new TransformNode(label("torusRoot"), scene)

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

		const headlocus = new TransformNode(label("headlocus"), scene)

		const headbox = MeshBuilder.CreateBox(
			label("box"),
			{size: 0.2},
			scene,
		)
		headbox.material = colors.green

		torusRoot.position.y = torusLift
		torus.position.y = torusLift
		headbox.position.y = torusLift + (torusDiameter / 2)
		headlocus.position.y = torusLift + (torusDiameter / 2)

		// parenting
		// headbox.setParent(headlocus)
		headlocus.setParent(torusRoot)
		torus.setParent(torusRoot)
		torusRoot.setParent(transform)

		this.#disposables
			.add(() => headlocus.dispose())
			.add(() => headbox.dispose())
			.add(() => torus.dispose())
			.add(() => torusRoot.dispose())
			.add(() => transform.dispose())

		return {transform, torusRoot, torus, headlocus, headbox}
	})()

	applyGimbal(gimbal: Vec2) {
		const {transform, torusRoot, headlocus, headbox} = this.parts
		const moddedGimbal = apply_spline_to_gimbal_y(gimbal, [0, .5, .9])
		const quaternions = gimbaltool(moddedGimbal).quaternions()
		transform.rotationQuaternion = quaternions.horizontal
		torusRoot.rotationQuaternion = quaternions.vertical
		headlocus.computeWorldMatrix(true)
		headbox.position = headlocus.absolutePosition.clone()
		headbox.rotationQuaternion = gimbaltool(gimbal).quaternions().combined
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

