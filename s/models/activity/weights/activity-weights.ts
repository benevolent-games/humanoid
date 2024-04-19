
import {Activity} from "../exports.js"
import {equipWeights} from "./kinds/equip-weights.js"
import {EquipReport} from "../reports/equip.js"
import {parryWeights} from "./kinds/parry-weights.js"
import {ParryReport} from "../reports/parry.js"
import {meleeWeights} from "./kinds/melee-weights.js"
import {meleeReport} from "../reports/melee/melee-report.js"
import {zeroWeights} from "./utils/zero-weights.js"

export function activityWeights(activity: Activity.Any | null) {
	if (!activity)
		return zeroWeights()

	switch (activity.kind) {

		case "equip":
			return equipWeights(new EquipReport(activity))

		case "parry":
			return parryWeights(new ParryReport(activity))

		case "melee":
			return meleeWeights(meleeReport(activity))

	}
}

