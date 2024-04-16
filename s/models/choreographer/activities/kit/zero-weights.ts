
import {ActivityWeights} from "./weights.js"

export const zeroWeights = (): ActivityWeights => ({
	active: 0,
	inactive: 1,
	equip: 0,
	parry: 0,
	progress: 0,
	a1: 0, a2: 0, a3: 0, a4: 0, a5: 0, a6: 0, a7: 0, a8: 0,
})

