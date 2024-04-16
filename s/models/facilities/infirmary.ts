
import {Ecs} from "@benev/toolbox"
import {Ribbon} from "../tracing/ribbon.js"
import {Activity} from "../activity/exports.js"
import {MeleeReport} from "../activity/reports/melee.js"
import {Health} from "../../ecs/components/topics/warrior.js"

/** utility methods for interacting with health. */
export class Infirmary {
	constructor(public health: Ecs.ComponentState<Health>) {}

	applyDamage(activity: Activity.Melee, ribbon: Ribbon) {
		const {health} = this
		const {weapon} = activity
		const {maneuver} = new MeleeReport(activity)
		const {blunt, bleed} = maneuver.current.technique === "swing"
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

