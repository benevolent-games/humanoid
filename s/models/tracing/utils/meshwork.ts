
import {vec3} from "@benev/toolbox"
import {Tracing} from "../types.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"

export function generate_data_for_ribbon(lines: Tracing.Line[]) {
	const edgeLines = lines.slice(-2)
	const sheetLines = lines.length >= 3
		? lines.slice(0, -1)
		: null

	const edgeData = generate_tracer_triangles(edgeLines)
	const [[,first], [,second]] = edgeLines
	const edgeVector = vec3.subtract(second, first)
	const edgeTriangles = edgeData.triangles.slice(-2) as Tracing.EdgeTriangles

	return {
		edgeData,
		edgeVector,
		edgeTriangles,
		sheetData: sheetLines && generate_tracer_triangles(sheetLines),
	}
}

export function generate_tracer_triangles(lines: Tracing.Line[]) {
	const positions: number[] = []
	const indices: number[] = []
	const triangles: Tracing.Triangle[] = []

	lines.forEach((lineY, index) => {
		positions.push(...lineY.flat())

		if (index === 0)
			return

		/*
		  -->
		 b---d
		 |1 /|
		X| / |Y
		 |/ 2|
		 a---c
		*/

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
	})

	const vertexData = new VertexData()
	vertexData.positions = positions
	vertexData.indices = indices

	return {vertexData, triangles}
}

