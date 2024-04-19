
import {Ecs} from "@benev/toolbox"
import {Ribbon} from "../tracing/ribbon.js"
import {Activity} from "../activity/exports.js"
import {Health} from "../../ecs/components/topics/warrior.js"
import {meleeReport} from "../activity/reports/melee/melee-report.js"

/** utility methods for interacting with health. */
export class Infirmary {
	constructor(public health: Ecs.ComponentState<Health>) {}

	applyDamage(activity: Activity.Melee, ribbon: Ribbon) {
		const {health} = this
		const {weapon} = activity
		const {activeManeuver} = meleeReport(activity)
		const {blunt, bleed} = activeManeuver.report.maneuver.technique === "swing"
			? weapon.swing.damage
			: weapon.stab.damage

		health.hp -= blunt
		health.bleed += bleed

		const bleedpoint = health.hp - health.bleed
		const overbleed = bleedpoint < 0
			? Math.abs(bleedpoint)
			: 0

		// overbleed is applied as additional blunt damage
		health.hp -= overbleed
	}
}

