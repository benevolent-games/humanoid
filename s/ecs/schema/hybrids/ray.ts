
import {HuRealm} from "../../../models/realm/realm.js"
import {MeshBuilder} from "@babylonjs/core/Meshes/meshBuilder.js"
import {HybridComponent, Vec3, babylonian, label} from "@benev/toolbox"

export class Ray extends HybridComponent<HuRealm, [Vec3, Vec3]> {
	// #a = babylonian.from.vec3([0, 0, 0])
	// #b = babylonian.from.vec3([0, 1, 0])

	// get a() { return babylonian.to.vec3(this.#a) }
	// get b() { return babylonian.to.vec3(this.#b) }

	// set a(v: Vec3) { this.#a.set(...v) }
	// set b(v: Vec3) { this.#b.set(...v) }

	#create_line() {
		return MeshBuilder.CreateLines(
			label("ray"),
			{
				points: [
					babylonian.from.vec3(this.state[0]),
					babylonian.from.vec3(this.state[1]),
				],
			},
			this.realm.scene,
		)
	}

	line = this.#create_line()

	created() {}
	updated() {
		this.line.dispose()
		this.line = this.#create_line()
	}
	deleted() {}
}

