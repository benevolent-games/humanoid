
import {nexus} from "../nexus.js"
import {register_to_dom} from "@benev/slate"
import {BenevHumanoid} from "../dom/elements/benev-humanoid/element.js"

/**
 * dom registration
 *  - we register our web components to the dom
 *  - this places the canvas and all of our ui
 */
export default () => {
	register_to_dom({BenevHumanoid})
	;(window as any).nexus = nexus
}

