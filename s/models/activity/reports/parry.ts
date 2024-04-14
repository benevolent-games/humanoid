
import {Activity} from "../exports.js"

export class ParryReport {
	readonly protective: boolean

	constructor(public activity: Activity.Parry) {
		const {weapon, seconds, holdable} = activity
		const {block} = weapon.parry.timing
		this.protective = !!(
			(seconds < block) ||
			(holdable && holdable.released !== null)
		)
	}
}

