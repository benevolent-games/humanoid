
import {Material} from "@babylonjs/core/Materials/material.js"

import {Tracing} from "./types.js"
import {HybridComponent} from "../../../hub.js"
import {apply_update_to_ribbon, establish_ribbon} from "./utils.js"

const tracer_count_limit = 3

export type TracerUpdate = {
	blueprint: Tracing.Blueprint | null
}

export class Tracers extends HybridComponent<{}> {

	#materials = {
		sheets: {
			handle: this.realm.colors.blue,
			damage: this.realm.colors.yellow,
			grace: this.realm.colors.green,
		} satisfies Record<Tracing.RibbonKind, Material>,
		edges: {
			handle: this.realm.colors.red,
			damage: this.realm.colors.red,
			grace: this.realm.colors.red,
		} satisfies Record<Tracing.RibbonKind, Material>,
	}

	#ribbonGroups: Tracing.Ribbon[][] = []

	wip: null | {
		lines: Tracing.Line[]
		data: Tracing.Ribbon
		edge: null | Tracing.RibbonEdge
	}[] = null

	update(update: TracerUpdate) {
		if (update.blueprint) {
			if (!this.wip) this.#start_tracing(update)
			else this.#continue_tracing(update)
		}
		else if (this.wip) this.#finish_tracing()

		this.#destroy_extra_ribbons()
	}

	#start_tracing({blueprint}: TracerUpdate) {
		const ribbonize = (proto: Tracing.ProtoRibbon) => ({
			spec: proto,
			edge: null,
			lines: [proto.line],
			data: establish_ribbon(
				this.realm.scene,
				this.realm.debug.meleeTracers,
				this.#materials.sheets[proto.kind],
				this.#materials.edges[proto.kind],
			),
		})
		this.wip = blueprint!.protoRibbons.map(ribbonize)
	}

	#continue_tracing({blueprint}: TracerUpdate) {
		if (this.wip) {
			blueprint!.protoRibbons.forEach((proto, index) => {
				const ribbon = this.wip![index]
				ribbon.lines.push(proto.line)
				ribbon.edge = apply_update_to_ribbon(ribbon.data, ribbon.lines)
			})
		}
	}

	#finish_tracing() {
		if (this.wip) {
			this.#ribbonGroups.push(this.wip.map(w => w.data))
			this.wip = null
		}
	}

	#destroy_extra_ribbons() {
		while (this.#ribbonGroups.length > tracer_count_limit)
			this.#ribbonGroups.shift()!.forEach(ribbon => ribbon.dispose())
	}

	created() {}

	deleted() {

		// delete all ribbons
		for (const ribbon of this.#ribbonGroups.flat())
			ribbon.dispose()

		// delete wip data
		for (const {data} of this.wip ?? [])
			data.dispose()

	}
}

