
//
// handy slate/lit ui tools
//

import {is} from "@benev/slate"

/** if the thing is defined, run it through the function, otherwise return null */
export function when<X, Y>(
		thing: X | undefined | null,
		fn: (x: X) => Y,
	) {

	return is.defined(thing)
		? fn(thing)
		: null
}

