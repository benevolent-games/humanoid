
import {HybridComponent} from "@benev/toolbox"

import {Tracing} from "./parts/types.js"
import {HuRealm} from "../../../../models/realm/realm.js"
import {apply_update_to_tracer_graphics, establish_tracer_graphics} from "./parts/fns.js"

export class Tracer extends HybridComponent<HuRealm, {lines: Tracing.Line[]}> {
	#graphics: null | Tracing.Graphics = null
	#lastLineCount = 0

	get details() {
		return this.#graphics
			? {
				direction: this.#graphics.ribbons.far.edgeVector,
				ribbonFarEdgeTriangles: this.#graphics.ribbons.far.edgeTriangles,
				ribbonNearEdgeTriangles: this.#graphics.ribbons.near.edgeTriangles,
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
		this.#lastLineCount = lines.length

		if (lines_have_changed) {
			if (lines.length < 2)
				this.#deleteGraphics()
			else {
				if (this.#graphics)
					apply_update_to_tracer_graphics(this.#graphics, lines)
				else
					this.#graphics = establish_tracer_graphics(scene, colors, lines)
			}
		}
	}
	deleted() {
		this.#deleteGraphics()
	}
}

