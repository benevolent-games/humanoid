
import {ActivityWeights, AnimMoment} from "./types.js"

const moment = (): AnimMoment => ({weight: 0, progress: 0})

export const zeroWeights = (): ActivityWeights => ({
	active: 0,
	equip: moment(),
	parry: moment(),
	a1: moment(),
	a2: moment(),
	a3: moment(),
	a4: moment(),
	a5: moment(),
	a6: moment(),
	a7: moment(),
	a8: moment(),
})

