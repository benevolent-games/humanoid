
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {HybridComponent, Vec3, label} from "@benev/toolbox"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"

import {HuRealm} from "../../../models/realm/realm.js"

export type TracerTriangle = [Vec3, Vec3, Vec3]

export class Tracer extends HybridComponent<HuRealm, {lines: [Vec3, Vec3][]}> {
	#ribbon: Mesh = new Mesh(label("tracer"), this.realm.scene)
	#bleeding_edge_mesh = new Mesh("bleeding_edge", this.realm.scene)

	bleeding_edge: [TracerTriangle, TracerTriangle] | null = null

	#draw() {
		const positions: number[] = []
		const indices: number[] = []

		this.state.lines.forEach((line, index) => {
			line.forEach(p => positions.push(...p))
			if (index > 0) {
				const startIndex = index * 2
				indices.push(startIndex - 2, startIndex - 1, startIndex)
				indices.push(startIndex - 1, startIndex + 1, startIndex)
			}
		})

		const data = new VertexData()
		data.positions = positions
		data.indices = indices
		data.applyToMesh(this.#ribbon)

		if(indices.length >= 6) {
			const lastIndices = indices.slice(-6)
			this.bleeding_edge = [
				[
					positions.slice(lastIndices[0] * 3, lastIndices[0] * 3 + 3) as Vec3,
					positions.slice(lastIndices[1] * 3, lastIndices[1] * 3 + 3) as Vec3,
					positions.slice(lastIndices[2] * 3, lastIndices[2] * 3 + 3) as Vec3,
				],
				[
					positions.slice(lastIndices[3] * 3, lastIndices[3] * 3 + 3) as Vec3,
					positions.slice(lastIndices[4] * 3, lastIndices[4] * 3 + 3) as Vec3,
					positions.slice(lastIndices[5] * 3, lastIndices[5] * 3 + 3) as Vec3,
				],
			]
		}

		if (this.bleeding_edge) {
			const positions: number[] = []
			const indices = [0, 1, 2, 3, 4, 5]
			this.bleeding_edge.flat().forEach(p => positions.push(...p))
			const bleedingEdgeData = new VertexData()
			bleedingEdgeData.positions = positions
			bleedingEdgeData.indices = indices
			bleedingEdgeData.applyToMesh(this.#bleeding_edge_mesh)
		}
	}

	created() {
		const red = this.realm.colors.red.clone(label("red"))
		const blue = this.realm.colors.blue.clone(label("blue"))
		red.alpha = 1
		red.zOffset = 0.1
		blue.alpha = 0.3
		this.#ribbon.material = blue
		this.#bleeding_edge_mesh.material = red
	}
	updated() { this.#draw() }
	deleted() {}
}

