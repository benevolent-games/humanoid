
import {ob} from "@benev/slate"
import {Vec2, scalar} from "@benev/toolbox"
import {Activity} from "../../activity/exports"

const {degrees} = scalar.radians.from

export type ActivityWeights = {
	active: number
	inactive: number
	equip: number
	parry: number
	a1: number
	a2: number
	a3: number
	a4: number
	a5: number
	a6: number
	a7: number
	a8: number
	progress: number
}

export function calculateActivityWeights(activity: Activity.Any) {
	const weights: ActivityWeights = {
		active: 0,
		inactive: 1,
		equip: 0,
		parry: 0,
		progress: 0,
		a1: 0, a2: 0, a3: 0, a4: 0, a5: 0, a6: 0, a7: 0, a8: 0,
	}

	return weights
}

