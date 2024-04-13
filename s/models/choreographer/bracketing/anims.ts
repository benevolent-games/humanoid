
import {scalar} from "@benev/toolbox"

export class AnimNode {
	static setWeight(node: AnimNode, w: number) { node.#weight = w }
	static setRelativeWeight(node: AnimNode, w: number) { node.#relativeWeight = w }

	#relativeWeight = 0
	#weight = 0

	get weight() { return this.#weight }
	get relativeWeight() { return this.#relativeWeight }

	constructor(public nodes: AnimNode[] = []) {}


}

export class AnimBracket extends AnimNode {
	#activeIndex: null | number = null

	constructor(
			public blendTimeSeconds: number,
			public nodes: AnimNode[],
		) {
		super(nodes)
	}

	activate(nodeToActivate: AnimNode) {
		const index = this.nodes.indexOf(nodeToActivate)
		if (index !== -1) this.#activeIndex = index
		else throw new Error("AnimNode missing in AnimBracket")
	}

	getActiveNode() {
		return this.#activeIndex !== null
			? this.nodes[this.#activeIndex]
			: undefined
	}

	recursivelyUpdateAllWeights(deltaSeconds: number) {
		const walk = (current: AnimNode) => {
			const weightDelta = deltaSeconds / this.blendTimeSeconds
			const activeNode = this.getActiveNode()
			const originalSum = current.nodes.reduce((sum, node) => sum + node.relativeWeight, 0)

			if (activeNode) {
				AnimNode.setRelativeWeight(activeNode, activeNode.relativeWeight + weightDelta)
				const sum = current.nodes.reduce((sum, node) => sum + node.relativeWeight, 0)
				let excess = sum - 1
				for (const node of current.nodes) {
					const decrease = Math.min(node.relativeWeight, excess * (node.relativeWeight / originalSum))
					AnimNode.setRelativeWeight(node, node.relativeWeight - decrease)
					excess -= decrease
					if (excess <= 0)
						break
				}
			}
			else {
				if (originalSum > 0) {
					const normalization = (originalSum - weightDelta) / originalSum
					for (const node of current.nodes)
						AnimNode.setRelativeWeight(node, node.relativeWeight * normalization)
				}
			}

			for (const node of current.nodes) {
				AnimNode.setRelativeWeight(node, scalar.clamp(node.relativeWeight))
				AnimNode.setWeight(node, node.relativeWeight * current.weight)
				walk(node)
			}
		}
		walk(this)
	}
}

