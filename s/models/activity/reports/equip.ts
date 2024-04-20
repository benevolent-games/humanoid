
import {scalar} from "@benev/toolbox"
import {Activity} from "../exports.js"

export class EquipReport {
	readonly readyToSwitch: boolean
	readonly progress: number
	readonly almostDone: boolean
	readonly done: boolean

	constructor(public activity: Activity.Equip) {
		const {seconds, duration} = activity
		this.progress = scalar.clamp(seconds / duration)
		this.readyToSwitch = this.progress > 0.5
		this.done = this.progress >= 1
		this.almostDone = this.progress >= (5 / 10)
	}
}

