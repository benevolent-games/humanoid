
import {Suite, expect} from "cynic"
import {AnimBracket, AnimNode} from "./anims.js"

export default <Suite>{
	async "anim brackets"() {
		const walking = new AnimNode()
		const running = new AnimNode()
		const jumping = new AnimNode()

		const bracket = new AnimBracket(1 / 10, [
			walking,
			running,
			jumping,
		])

		return true
	},
}

