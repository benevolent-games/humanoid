
import {hub} from "../hub.js"

export const example_processor_system = hub
	.behavior("example_processor") // system name
	.select("force") // selected components
	.processor(_base => _tick => state => {

	state.force = state.force
})

export const example_lifecycle_system = hub
	.behavior("example_lifecycle") // system name
	.select("force") // selected components
	.lifecycle(_base => (_init, _id) => {

	return {
		execute(_tick, state, _id) {
			state.force = state.force
		},
		dispose() {},
	}
})

