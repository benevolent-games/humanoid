
import {label} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"

import {Tracing} from "../types.js"
import {generate_data_for_ribbon} from "./utils.js"

export class Ribbon {
	sheetMesh: Mesh
	edgeMesh: Mesh
	lines: Tracing.Line[] = []

	constructor(
			scene: Scene,
			public kind: Tracing.RibbonKind,
			appearance: Tracing.Appearance,
		) {

		this.sheetMesh = new Mesh(label("ribbon-sheet"), scene)
		this.sheetMesh.material = appearance.sheets[kind]
		this.sheetMesh.isVisible = appearance.isVisible

		this.edgeMesh = new Mesh(label("ribbon-edge"), scene)
		this.edgeMesh.material = appearance.edges[kind]
		this.edgeMesh.isVisible = appearance.isVisible
	}

	addSegment(line: Tracing.Line): Tracing.RibbonEdge {
		this.lines.push(line)

		// recompute entire ribbon
		const {sheetData, edgeData, edgeTriangles, edgeVector} = (
			generate_data_for_ribbon(this.lines)
		)

		// apply data to the meshes
		edgeData.vertexData.applyToMesh(this.edgeMesh)
		sheetData?.vertexData.applyToMesh(this.sheetMesh)

		// return the edge triangles
		return {
			vector: edgeVector,
			triangles: edgeTriangles,
		}
	}

	dispose() {
		this.sheetMesh.dispose()
		this.edgeMesh.dispose()
	}
}

