
import {scalar} from "@benev/toolbox"
import {ActivityWeights, AnimMoment} from "./weights.js"

export function combineMoment(m1: AnimMoment, m2: AnimMoment): AnimMoment {
	return {
		weight: scalar.clamp(m1.weight + m2.weight),
		progress: Math.max(m1.progress, m2.progress),
	}
}

export function combineWeights(w1: ActivityWeights, w2: ActivityWeights): ActivityWeights {
	const active = scalar.clamp(w1.active + w2.active)
	return {
		active,
		equip: combineMoment(w1.equip, w2.equip),
		parry: combineMoment(w1.parry, w2.parry),
		a1: combineMoment(w1.a1, w2.a1),
		a2: combineMoment(w1.a2, w2.a2),
		a3: combineMoment(w1.a3, w2.a3),
		a4: combineMoment(w1.a4, w2.a4),
		a5: combineMoment(w1.a5, w2.a5),
		a6: combineMoment(w1.a6, w2.a6),
		a7: combineMoment(w1.a7, w2.a7),
		a8: combineMoment(w1.a8, w2.a8),
	}
}

