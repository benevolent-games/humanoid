
import {zeroWeights} from "./kit/zero-weights.js"
import {Activity} from "../../activity/exports.js"
import {equipParry} from "./kinds/parry-weights.js"
import {equipMelee} from "./kinds/melee-weights.js"
import {equipWeights} from "./kinds/equip-weights.js"
import {EquipReport} from "../../activity/reports/equip.js"
import {ParryReport} from "../../activity/reports/parry.js"
import {MeleeReport} from "../../activity/reports/melee.js"

export function calculateActivityWeights(activity: Activity.Any | null) {
	if (!activity)
		return zeroWeights()

	switch (activity.kind) {

		case "equip":
			return equipWeights(new EquipReport(activity))

		case "parry":
			return equipParry(new ParryReport(activity))

		case "melee":
			return equipMelee(new MeleeReport(activity))

	}
}

