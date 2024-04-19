
import {Activity} from "../exports.js"
import {EquipReport} from "../reports/equip.js"
import {ParryReport} from "../reports/parry.js"
import {meleeReport} from "../reports/melee/melee-report.js"
import { MeleeReport } from "../reports/melee/parts/types.js"

export function makeActivityReport(activity: Activity.Any) {
	if (activity.kind === "equip")
		return new EquipReport(activity)

	else if (activity.kind === "parry")
		return new ParryReport(activity)

	else if (activity.kind === "melee")
		return meleeReport(activity)

	else
		throw new Error(`unknown activity kind`)
}

export function isMeleeReport(report: EquipReport | ParryReport | MeleeReport): report is MeleeReport {
	return report.activity.kind === "melee"
}

