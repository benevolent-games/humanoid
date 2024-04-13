
import type {Suite} from "cynic"

// emulate the browser in node, so we can accidentally import browser modules without exploding
Object.assign(global, {HTMLElement: class {}})

export default await async function() {
	return <Suite>{
		animBracketing: await import("./models/choreographer/bracketing/anims.test.js"),
	}
}()

