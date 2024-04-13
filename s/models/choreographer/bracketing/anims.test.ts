
import {Suite, expect} from "cynic"
import {AnimBracket, AnimLeaf, AnimNode} from "./anims.js"

export default <Suite>{
	async "anim brackets"() {
		const walking = new AnimLeaf()
		const running = new AnimLeaf()
		const jumping = new AnimLeaf()

		const bracket = AnimBracket.root(1, [
			walking,
			running,
			jumping,
		])

		expect(bracket.weight).equals(1)
		expect(walking.weight).equals(0)
		expect(running.weight).equals(0)
		expect(jumping.weight).equals(0)

		bracket.activate(walking)
		bracket.recursivelyUpdateAllWeights(0.1)
		// expect(bracket.weight).equals(1)
		expect(walking.weight).equals(0.5)
		// expect(running.weight).equals(0)
		// expect(jumping.weight).equals(0)
	},
}

