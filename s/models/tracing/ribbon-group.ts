
import {Ribbon} from "./ribbon.js"
import {Tracing} from "./types.js"
import {Scene} from "@babylonjs/core/scene.js"

export class RibbonGroup {
	ribbons: Ribbon[]

	constructor(
			scene: Scene,
			public ensemble: Tracing.Ensemble,
			appearance: Tracing.Appearance,
		) {
		const blueprint = ensemble.makeRibbonBlueprint()
		this.ribbons = blueprint.protoRibbons.map(
			proto => {
				const ribbon = new Ribbon(scene, proto.kind, appearance)
				ribbon.lines.push(proto.line)
				return ribbon
			}
		)
	}

	step() {
		const blueprint = this.ensemble.makeRibbonBlueprint()
		return blueprint.protoRibbons.map((proto, index) => {
			const ribbon = this.ribbons[index]
			if (!ribbon) throw new Error("ribbon not found")
			const edge = ribbon.addSegment(proto.line)
			return {ribbon, edge}
		})
	}

	dispose() {
		this.ribbons.forEach(r => r.dispose())
	}
}

