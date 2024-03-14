
import {DebugColors} from "@benev/toolbox"
import {Scene} from "@babylonjs/core/scene.js"

import {Tracing} from "./types.js"
import {apply_update_to_ribbon, establish_ribbon, require_at_least_two_lines, split_lines} from "./utils/utils.js"

export function establish_tracer_graphics(
		scene: Scene,
		colors: DebugColors,
		lines: Tracing.Line[],
	): Tracing.Graphics {
	require_at_least_two_lines(lines)
	const {nearLines, farLines} = split_lines(lines)
	const near = establish_ribbon(scene, nearLines, colors.blue, colors.red)
	const far = establish_ribbon(scene, farLines, colors.cyan, colors.magenta)
	return {
		ribbons: {near, far},
		dispose() {
			near.edgeMesh.dispose()
			near.sheetMesh.dispose()
			far.edgeMesh.dispose()
			far.sheetMesh.dispose()
		},
	}
}

export function apply_update_to_tracer_graphics(graphics: Tracing.Graphics, lines: Tracing.Line[]) {
	require_at_least_two_lines(lines)
	const {nearLines, farLines} = split_lines(lines)
	apply_update_to_ribbon(graphics.ribbons.near, nearLines)
	apply_update_to_ribbon(graphics.ribbons.far, farLines)
}

