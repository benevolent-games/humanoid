
import {Activity} from "../exports.js"
import {EquipReport} from "../reports/equip.js"
import {MeleeReport} from "../reports/melee.js"
import {ParryReport} from "../reports/parry.js"

export function makeActivityReport(activity: Activity.Any) {
	if (activity.kind === "equip")
		return new EquipReport(activity)

	else if (activity.kind === "parry")
		return new ParryReport(activity)

	else if (activity.kind === "melee")
		return new MeleeReport(activity)

	else
		throw new Error(`unknown activity kind`)
}

