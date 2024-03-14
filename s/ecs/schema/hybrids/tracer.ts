
import {deep} from "@benev/slate"
import {Scene} from "@babylonjs/core/scene.js"
import {Mesh} from "@babylonjs/core/Meshes/mesh.js"
import {DebugColors, HybridComponent, Vec3, label, vec3} from "@benev/toolbox"
import {VertexData} from "@babylonjs/core/Meshes/mesh.vertexData.js"

import {HuRealm} from "../../../models/realm/realm.js"
import {Material} from "@babylonjs/core/Materials/material.js"

export type TracerLine = [Vec3, Vec3]
export type TracerTriangle = [Vec3, Vec3, Vec3]
export type TracerEdgeTriangles = [TracerTriangle, TracerTriangle]

type Ribbon = {
	sheetMesh: Mesh
	edgeMesh: Mesh
	edgeVector: Vec3
	edgeTriangles: TracerEdgeTriangles
}

type TracerGraphics = {
	ribbons: {
		far: Ribbon
		// near: Ribbon
	}
	dispose: () => void
}

function require_at_least_two_lines(lines: TracerLine[]) {
	if (lines.length < 2)
		throw new Error("tracer requires at least two lines")
}

export function generate_data_for_ribbon(lines: TracerLine[]) {
	require_at_least_two_lines(lines)

	const edgeLines = lines.slice(-2)
	const sheetLines = lines.length >= 3
		? lines.slice(0, -1)
		: null

	const edgeData = generate_tracer_triangles(edgeLines)
	const [[,first], [,second]] = edgeLines
	const edgeVector = vec3.subtract(second, first)
	const edgeTriangles = edgeData.triangles.slice(-2) as TracerEdgeTriangles

	return {
		edgeData,
		edgeVector,
		edgeTriangles,
		sheetData: sheetLines && generate_tracer_triangles(sheetLines),
	}
}

function generate_tracer_triangles(lines: TracerLine[]) {
	const positions: number[] = []
	const indices: number[] = []
	const triangles: TracerTriangle[] = []

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

export function establish_tracer_graphics(
		scene: Scene,
		colors: DebugColors,
		lines: TracerLine[],
	): TracerGraphics {
	require_at_least_two_lines(lines)
	const far = establish_ribbon(
		scene,
		lines,
		colors.blue,
		colors.red,
	)
	return {
		ribbons: {far},
		dispose() {
			far.edgeMesh.dispose()
			far.sheetMesh.dispose()
		},
	}
}

function establish_ribbon(
		scene: Scene,
		lines: TracerLine[],
		sheetMaterial: Material,
		edgeMaterial: Material,
	): Ribbon {

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

export function apply_update_to_ribbon(ribbon: Ribbon, lines: TracerLine[]) {
	const {sheetData, edgeData, edgeTriangles, edgeVector} = (
		generate_data_for_ribbon(lines)
	)
	ribbon.edgeVector = edgeVector
	ribbon.edgeTriangles = edgeTriangles
	edgeData.vertexData.applyToMesh(ribbon.edgeMesh)
	sheetData?.vertexData.applyToMesh(ribbon.sheetMesh)
}

export class Tracer extends HybridComponent<HuRealm, {lines: TracerLine[]}> {
	#graphics: null | TracerGraphics = null
	#lastLineCount = 0

	get details() {
		return this.#graphics
			? {
				direction: this.#graphics.ribbons.far.edgeVector,
				ribbonFarEdgeTriangles: this.#graphics.ribbons.far.edgeTriangles
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
		const {scene, colors} = this.realm
		const {lines} = this.state
		const lines_have_changed = lines.length !== this.#lastLineCount

		if (lines_have_changed) {
			if (lines.length < 2) {
				this.#deleteGraphics()
			}
			else {
				if (this.#graphics) {
					apply_update_to_ribbon(this.#graphics.ribbons.far, lines)
				}
				else {
					this.#graphics = establish_tracer_graphics(scene, colors, lines)
				}
			}
		}
	}
	deleted() {
		this.#deleteGraphics()
	}
}

