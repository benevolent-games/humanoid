
import {deep} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {DebugColors, HybridComponent, Vec3, label, vec3} from "@benev/toolbox"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"

import {HuRealm} from "../../../models/realm/realm.js"

export type TracerLine = [Vec3, Vec3]
export type TracerTriangle = [Vec3, Vec3, Vec3]

type Ribbon = {
	sheet: Mesh
	edge: Mesh
	triangles: TracerTriangle[]
}

type Graphics = {
	ribbonNear: Ribbon
	ribbonFar: Ribbon
	direction: Vec3
	dispose: () => void
}

export class Tracer extends HybridComponent<HuRealm, {lines: TracerLine[]}> {

	static makeGraphics(scene: Scene, colors: DebugColors): Graphics {
		const direction = vec3.zero()
		const ribbonNear: Ribbon = {
			sheet: new Mesh(label("ribbon-near-sheet"), scene),
			edge: new Mesh(label("ribbon-near-edge"), scene),
			triangles: [],
		}
		const ribbonFar: Ribbon = {
			sheet: new Mesh(label("ribbon-far-sheet"), scene),
			edge: new Mesh(label("ribbon-far-edge"), scene),
			triangles: [],
		}
		ribbonNear.sheet.material = colors.red
		ribbonFar.sheet.material = colors.yellow
		ribbonNear.edge.material = colors.magenta
		ribbonFar.edge.material = colors.magenta
		return {
			ribbonNear,
			ribbonFar,
			direction,
			dispose() {
				ribbonNear.sheet.dispose()
				ribbonNear.edge.dispose()
				ribbonFar.sheet.dispose()
				ribbonFar.edge.dispose()
			},
		}
	}

	static generateRibbonSheetData(lines: TracerLine[]) {
		const positions: number[] = []
		const indices: number[] = []
		const triangles: TracerTriangle[] = []

		/*

		 b---d
		 |1 /|
		X| / |Y
		 |/ 2|
		 a---c

		*/

		lines.forEach((lineY, index) => {
			positions.push(...lineY.flat())
			if (index > 0) {

				const lineX = lines[index - 1]
				const [a, b] = lineX
				const [c, d] = lineY

				const firstIndex = (index - 1) * 2
				const aI = firstIndex
				const bI = firstIndex + 1
				const cI = firstIndex + 2
				const dI = firstIndex + 3

				indices.push(aI, bI, dI)
				indices.push(dI, cI, aI)

				triangles.push([a, b, d])
				triangles.push([d, c, a])
			}
		})

		const data = new VertexData()
		data.positions = positions
		data.indices = indices
		return {data, triangles}
	}

	static generateRibbonEdgeData(triangles: TracerTriangle[]) {
		if (triangles.length < 2)
			return null

		const data = new VertexData()
		data.positions = triangles.flat(2)
		data.indices = [0, 1, 2, 3, 4, 5]

		const [[,b,d]] = triangles
		const direction = vec3.subtract(d, b)

		return {data, direction}
	}

	#graphics: null | Graphics = null
	#lastLines: [Vec3, Vec3][] = []

	get details() {
		return this.#graphics
			? {
				direction: this.#graphics.direction,
				ribbonFarEdgeTriangles: this.#graphics.ribbonFar.triangles.length >= 2
					? this.#graphics.ribbonFar.triangles.slice(-2)
					: null,
			}
			: null
	}

	#deleteGraphics() {
		if (this.#graphics) {
			this.#graphics.dispose()
			this.#graphics = null
		}
	}

	created() {}
	updated() {
		const {lines} = this.state
		const lines_have_changed = !deep.equal(lines, this.#lastLines)

		if (lines_have_changed) {
			if (lines.length === 0) {
				this.#deleteGraphics()
			}
			else {
				if (!this.#graphics)
					this.#graphics = Tracer.makeGraphics(this.realm.scene, this.realm.colors)

				const graphics = this.#graphics

				const sheet = Tracer.generateRibbonSheetData(lines)
				sheet.data.applyToMesh(graphics.ribbonFar.sheet)
				graphics.ribbonFar.triangles = sheet.triangles

				const edge = Tracer.generateRibbonEdgeData(sheet.triangles.slice(-2))
				if (edge) {
					edge.data.applyToMesh(graphics.ribbonFar.edge)
					graphics.direction = edge.direction
				}
			}
		}
	}
	deleted() {
		this.#deleteGraphics()
	}
}

// export class Tracer extends HybridComponent<HuRealm, {lines: [Vec3, Vec3][]}> {
// 	#ribbon: Mesh = new Mesh(label("tracer"), this.realm.scene)
// 	#bleeding_edge_mesh = new Mesh("bleeding_edge", this.realm.scene)

// 	bleeding_edge: [TracerTriangle, TracerTriangle] | null = null
// 	direction: Vec3 | null = null

// 	reset() {
// 		this.bleeding_edge = null
// 		this.direction = null
// 	}

// 	#draw() {
// 		const positions: number[] = []
// 		const indices: number[] = []

// 		this.state.lines.forEach((line, index) => {
// 			line.forEach(p => positions.push(...p))
// 			if (index > 0) {
// 				const startIndex = index * 2
// 				indices.push(startIndex - 2, startIndex - 1, startIndex)
// 				indices.push(startIndex - 1, startIndex + 1, startIndex)
// 			}
// 		})

// 		const data = new VertexData()
// 		data.positions = positions
// 		data.indices = indices
// 		data.applyToMesh(this.#ribbon)

// 		if (indices.length >= 6) {
// 			const lastIndices = indices.slice(-6)
// 			this.bleeding_edge = [
// 				[
// 					positions.slice(lastIndices[0] * 3, lastIndices[0] * 3 + 3) as Vec3,
// 					positions.slice(lastIndices[1] * 3, lastIndices[1] * 3 + 3) as Vec3,
// 					positions.slice(lastIndices[2] * 3, lastIndices[2] * 3 + 3) as Vec3,
// 				],
// 				[
// 					positions.slice(lastIndices[3] * 3, lastIndices[3] * 3 + 3) as Vec3,
// 					positions.slice(lastIndices[4] * 3, lastIndices[4] * 3 + 3) as Vec3,
// 					positions.slice(lastIndices[5] * 3, lastIndices[5] * 3 + 3) as Vec3,
// 				],
// 			]
// 		}

// 		if (this.bleeding_edge) {
// 			const positions: number[] = []
// 			const indices = [0, 1, 2, 3, 4, 5]
// 			this.bleeding_edge.flat().forEach(p => positions.push(...p))
// 			const bleedingEdgeData = new VertexData()
// 			bleedingEdgeData.positions = positions
// 			bleedingEdgeData.indices = indices
// 			bleedingEdgeData.applyToMesh(this.#bleeding_edge_mesh)
// 		}

// 		if (this.state.lines.length >= 2) {
// 			const [,a] = this.state.lines.at(-1)!
// 			const [,b] = this.state.lines.at(-2)!
// 			this.direction = vec3.subtract(a, b)
// 		}
// 	}

// 	created() {
// 		const red = this.realm.colors.red.clone(label("red"))
// 		const blue = this.realm.colors.blue.clone(label("blue"))
// 		red.alpha = 1
// 		red.zOffset = 0.1
// 		blue.alpha = 0.3
// 		this.#ribbon.material = blue
// 		this.#bleeding_edge_mesh.material = red
// 	}
// 	updated() { this.#draw() }
// 	deleted() {}
// }

