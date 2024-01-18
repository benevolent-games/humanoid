
import {mainthread} from "../hub.js"

export const example_processor_system = mainthread.processor
	("example_processor") // system name
	("force") // selected components
	(_base => _tick => state => {

	state.force = state.force
})

export const example_lifecycle_system = mainthread.lifecycle
	("example_lifecycle") // system name
	("force") // selected components
	(_base => (_init, _id) => {

	return {
		execute(_tick, state, _id) {
			state.force = state.force
		},
		dispose() {},
	}
})

