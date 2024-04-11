
import {HybridComponent} from "../../hub.js"
import {Tracing} from "../../../models/tracing/types.js"
import {RibbonGroup} from "../../../models/tracing/ribbon-group.js"

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

