
import {Tracing} from "../types.js"
import {label, vec3} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {Material} from "@babylonjs/core/Materials/material.js"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"

export function require_at_least_two_lines(lines: Tracing.Line[]) {
	if (lines.length < 2)
		throw new Error("tracer requires at least two lines")
}

export function split_lines(lines: Tracing.Line[]) {
	const nearsize = 1 / 2
	const nearLines: Tracing.Line[] = []
	const farLines: Tracing.Line[] = []

	for (const [start, end] of lines) {
		const vector = vec3.subtract(end, start)
		const length = vec3.magnitude(vector)
		const midvector = vec3.multiplyBy(vector, length * nearsize)
		const midpoint = vec3.add(start, midvector)
		nearLines.push([start, midpoint])
		farLines.push([midpoint, end])
	}

	return {nearLines, farLines}
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

export function establish_ribbon(
		scene: Scene,
		lines: Tracing.Line[],
		sheetMaterial: Material,
		edgeMaterial: Material,
	): Tracing.Ribbon {

	const {sheetData, edgeData, edgeTriangles, edgeVector} = (
		generate_data_for_ribbon(lines)
	)

	const sheetMesh = new Mesh(label("ribbon-sheet"), scene)
	sheetData?.vertexData.applyToMesh(sheetMesh)
	sheetMesh.material = sheetMaterial

	const edgeMesh = new Mesh(label("ribbon-edge"), scene)
	edgeData.vertexData.applyToMesh(edgeMesh)
	edgeMesh.material = edgeMaterial

	return {
		sheetMesh,
		edgeMesh,
		edgeTriangles,
		edgeVector,
	}
}

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

export function apply_update_to_ribbon(ribbon: Tracing.Ribbon, lines: Tracing.Line[]) {
	const {sheetData, edgeData, edgeTriangles, edgeVector} = (
		generate_data_for_ribbon(lines)
	)
	ribbon.edgeVector = edgeVector
	ribbon.edgeTriangles = edgeTriangles
	edgeData.vertexData.applyToMesh(ribbon.edgeMesh)
	sheetData?.vertexData.applyToMesh(ribbon.sheetMesh)
}

