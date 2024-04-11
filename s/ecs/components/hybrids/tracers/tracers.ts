
import {Tracing} from "./types.js"
import {HybridComponent} from "../../../hub.js"
import {RibbonGroup} from "./utils/ribbon-group.js"

const tracer_count_limit = 3

export class Tracers extends HybridComponent<{}> {
	#materials = {
		sheets: {
			handle: this.realm.colors.blue,
			damage: this.realm.colors.yellow,
			grace: this.realm.colors.green,
		},
		edges: {
			handle: this.realm.colors.red,
			damage: this.realm.colors.red,
			grace: this.realm.colors.red,
		},
	}

	current: RibbonGroup | null = null
	history: RibbonGroup[] = []

	start(ensemble: Tracing.Ensemble, isVisible: boolean) {
		const {scene} = this.realm
		const appearance: Tracing.Appearance = {...this.#materials, isVisible}
		this.current = new RibbonGroup(scene, ensemble, appearance)
	}

	continue() {
		return this.current!.step()
	}

	finish() {
		this.history.push(this.current!)
		this.current = null

		while (this.history.length > tracer_count_limit)
			this.history.shift()!.dispose()
	}

	/////////////////////////////

	created() {}

	deleted() {
		if (this.current)
			this.current.dispose()

		for (const group of this.history)
			group.dispose()
	}
}

// export class Tracers extends HybridComponent<{}> {

// 	#materials = {
// 		sheets: {
// 			handle: this.realm.colors.blue,
// 			damage: this.realm.colors.yellow,
// 			grace: this.realm.colors.green,
// 		} satisfies Record<Tracing.RibbonKind, Material>,
// 		edges: {
// 			handle: this.realm.colors.red,
// 			damage: this.realm.colors.red,
// 			grace: this.realm.colors.red,
// 		} satisfies Record<Tracing.RibbonKind, Material>,
// 	}

// 	#ribbonGroups: Tracing.Ribbon[][] = []

// 	ribbon: Ribbon | null = null

// 	// wip: null | {
// 	// 	lines: Tracing.Line[]
// 	// 	data: Tracing.Ribbon
// 	// 	edge: null | Tracing.RibbonEdge
// 	// }[] = null

// 	update(update: TracerUpdate) {
// 		if (update.blueprint) {
// 			if (!this.wip) this.#start_tracing(update)
// 			else this.#continue_tracing(update)
// 		}
// 		else if (this.wip) this.#finish_tracing()

// 		this.#destroy_extra_ribbons()
// 	}

// 	#start_tracing({blueprint}: TracerUpdate) {
// 		const ribbonize = (proto: Tracing.ProtoRibbon) => ({
// 			spec: proto,
// 			edge: null,
// 			lines: [proto.line],
// 			data: establish_ribbon(
// 				this.realm.scene,
// 				this.realm.debug.meleeTracers,
// 				this.#materials.sheets[proto.kind],
// 				this.#materials.edges[proto.kind],
// 			),
// 		})
// 		this.wip = blueprint!.protoRibbons.map(ribbonize)
// 	}

// 	#continue_tracing({blueprint}: TracerUpdate) {
// 		if (this.wip) {
// 			blueprint!.protoRibbons.forEach((proto, index) => {
// 				const ribbon = this.wip![index]
// 				ribbon.lines.push(proto.line)
// 				ribbon.edge = apply_update_to_ribbon(ribbon.data, ribbon.lines)
// 			})
// 		}
// 	}

// 	#finish_tracing() {
// 		if (this.wip) {
// 			this.#ribbonGroups.push(this.wip.map(w => w.data))
// 			this.wip = null
// 		}
// 	}

// 	#destroy_extra_ribbons() {
// 		while (this.#ribbonGroups.length > tracer_count_limit)
// 			this.#ribbonGroups.shift()!.forEach(ribbon => ribbon.dispose())
// 	}

// 	created() {}

// 	deleted() {

// 		// delete all ribbons
// 		for (const ribbon of this.#ribbonGroups.flat())
// 			ribbon.dispose()

// 		// delete wip data
// 		for (const {data} of this.wip ?? [])
// 			data.dispose()

// 	}
// }

