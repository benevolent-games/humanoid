
import {DebugColors} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"

import {Tracing} from "./types.js"
import {establish_ribbon, generate_data_for_ribbon, require_at_least_two_lines} from "./utils/utils.js"

export function establish_tracer_graphics(
		scene: Scene,
		colors: DebugColors,
		lines: Tracing.Line[],
	): Tracing.Graphics {
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

export function apply_update_to_ribbon(ribbon: Tracing.Ribbon, lines: Tracing.Line[]) {
	require_at_least_two_lines(lines)
	const {sheetData, edgeData, edgeTriangles, edgeVector} = (
		generate_data_for_ribbon(lines)
	)
	ribbon.edgeVector = edgeVector
	ribbon.edgeTriangles = edgeTriangles
	edgeData.vertexData.applyToMesh(ribbon.edgeMesh)
	sheetData?.vertexData.applyToMesh(ribbon.sheetMesh)
}

