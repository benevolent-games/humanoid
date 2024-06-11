
//
// handy slate/lit ui tools
//

import {is} from "@benev/slate"
import {noChange, ElementPart} from "lit"
import {directive, Directive, PartType, PartInfo} from "lit/directive.js"

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
 * use this directive instead of "@click" to make your event handlers
 * operate "on press" instead of "on release", just the way john carmack
 * likes it.
 *
 * unlike simply using "@mousedown", this directive is better for
 * accessibility, because it still uses "click" events as a fallback (which
 * accepts keyboard navigation and other special controls).
 *
 * for context, see his tweet about "act on press":
 *  - https://x.com/ID_AA_Carmack/status/1787850053912064005
 */
export const onCarmackClick = (() => {
	class Carmacked extends Directive {
		constructor(part: PartInfo) {
			super(part)
			if (part.type !== PartType.ELEMENT)
				throw new Error("carmacked directive must be in element position")
		}

		#preventClick = false

		update(part: ElementPart, [fn]: [(event: MouseEvent) => void]) {
			if (typeof fn !== "function")
				throw new Error("carmacked directive was not provided a callback function")

			if (!(part.element instanceof HTMLElement))
				throw new Error("carmacked directive can only be used on html elements")

			part.element.onmousedown = (event: MouseEvent) => {
				fn(event)
				this.#preventClick = true
			}

			part.element.onclick = (event: MouseEvent) => {
				if (!this.#preventClick)
					fn(event)
				this.#preventClick = false
			}

			return this.render(fn)
		}

		render(fn: (event: MouseEvent) => void) {
			void fn
			return noChange
		}
	}

	return directive(Carmacked)
})()

