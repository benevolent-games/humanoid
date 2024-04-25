
import {Control} from "./parts/control.js"

export class Net {
	#control = new Control()
	get handler() { return this.#control.handler }
}

