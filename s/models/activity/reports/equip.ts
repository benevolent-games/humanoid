
import {Activity} from "../exports.js"

export class EquipReport {
	readonly readyToSwitch: boolean

	constructor(public activity: Activity.Equip) {
		const {duration} = activity
		const midpoint = duration / 2
		this.readyToSwitch = activity.seconds > midpoint
	}
}

