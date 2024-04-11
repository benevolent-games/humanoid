
import {Ecs} from "@benev/toolbox"
import {Melee} from "../attacking/melee.js"
import {Health} from "../../ecs/components/topics/warrior.js"
import {Ribbon} from "../../ecs/components/hybrids/tracers/utils/ribbon.js"

/** utility methods for interacting with health. */
export class Infirmary {
	constructor(public health: Ecs.ComponentState<Health>) {}

	applyDamage(action: Melee.Action.Attack, ribbon: Ribbon) {
		const {health} = this
		const {weapon} = action
		const {blunt, bleed} = Melee.is.swing(action)
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

