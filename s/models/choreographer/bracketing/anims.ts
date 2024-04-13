
import {scalar} from "@benev/toolbox"

export type AnimNode = AnimBracket | AnimLeaf
const weight = Symbol()
const relweight = Symbol()

export class AnimLeaf {
	;[weight] = 0
	;[relweight] = 0
	get weight() { return this[weight] }
}

export class AnimBracket extends AnimLeaf {
	static root(blendtime: number, nodes: AnimNode[]) {
		const bracket = new this(blendtime, nodes)
		bracket[weight] = 1
		bracket[relweight] = 1
		return bracket
	}

	#blendtime: number
	#nodes: AnimNode[]
	#activeIndex: null | number = null

	constructor(blendtime: number, nodes: AnimNode[]) {
		super()
		this.#blendtime = blendtime
		this.#nodes = nodes
	}

	activate(nodeToActivate: AnimNode) {
		const index = this.#nodes.indexOf(nodeToActivate)
		if (index !== -1) this.#activeIndex = index
		else throw new Error("AnimNode missing in AnimBracket")
	}

	getActiveNode() {
		return this.#activeIndex !== null
			? this.#nodes[this.#activeIndex]
			: undefined
	}

	recursivelyUpdateAllWeights(deltaSeconds: number) {
		const walk = (current: AnimBracket) => {
			const weightDelta = deltaSeconds / current.#blendtime
			console.log("weightDelta", weightDelta)
			const activeNode = current.getActiveNode()
			const originalSum = current.#nodes.reduce((sum, node) => sum + node[relweight], 0)
			console.log("originalSum", originalSum)

			if (activeNode) {
				activeNode[relweight] += weightDelta
				const sum = current.#nodes.reduce((sum, node) => sum + node[relweight], 0)
				let excess = sum - 1
				for (const node of current.#nodes) {
					const decrease = Math.min(node[relweight], excess * (node[relweight] / (originalSum || 1)))
					node[relweight] -= decrease
					excess -= decrease
					if (excess <= 0)
						break
				}
				console.log("active", activeNode[relweight])
			}
			else {
				if (originalSum > 0) {
					const normalization = (originalSum - weightDelta) / originalSum
					for (const node of current.#nodes)
						node[relweight] *= normalization
				}
			}

			for (const node of current.#nodes) {
				node[relweight] = scalar.clamp(node[relweight])
				node[weight] = node[relweight] * current.weight
				if (node instanceof AnimBracket)
					walk(node)
			}
		}
		walk(this)
	}
}

