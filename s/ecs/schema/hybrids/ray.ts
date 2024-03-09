
import {HuRealm} from "../../../models/realm/realm.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {HybridComponent, Vec3, babylonian, label} from "@benev/toolbox"

export class Ray extends HybridComponent<HuRealm, [Vec3, Vec3]> {
	#a = babylonian.from.vec3([0, 0, 0])
	#b = babylonian.from.vec3([0, 1, 0])

	get a() { return babylonian.to.vec3(this.#a) }
	get b() { return babylonian.to.vec3(this.#b) }

	set a(v: Vec3) { this.#a.set(...v) }
	set b(v: Vec3) { this.#b.set(...v) }

	line = MeshBuilder.CreateLines(
		label("ray"),
		{points: [this.#a, this.#b]},
		this.realm.scene,
	)

	created() {}
	updated() {
		const [a, b] = this.state
		this.a = a
		this.b = b
	}
	deleted() {}
}

