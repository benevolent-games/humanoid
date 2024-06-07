
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

/**
 * prepare a 'mousedown' handler, which prevents 'click' handlers from working.
 * see john carmack's tweet about "act on press":
 *  - https://x.com/ID_AA_Carmack/status/1787850053912064005
 */
export function carmackify(fn: (event: MouseEvent) => void) {
	return (event: MouseEvent) => {
		fn(event)
		event.preventDefault()
	}
}

