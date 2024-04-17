
export type ActivityWeights = {
	active: number
	inactive: number
	equip: AnimMoment
	parry: AnimMoment
	a1: AnimMoment
	a2: AnimMoment
	a3: AnimMoment
	a4: AnimMoment
	a5: AnimMoment
	a6: AnimMoment
	a7: AnimMoment
	a8: AnimMoment
}

export type AnimMoment = {
	weight: number
	progress: number
}

