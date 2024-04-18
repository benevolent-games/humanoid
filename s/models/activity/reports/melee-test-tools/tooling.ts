
import {scalar} from "@benev/toolbox"

import {MeleeReport} from "../melee.js"
import {Activity} from "../../exports.js"
import {Weapon} from "../../../armory/weapon.js"

export function setupWeapon(): Weapon.Loadout {
	return {
		name: "axe",
		swing: {
			timing: {windup: 1, release: 2, combo: 3, recovery: 4},
			damage: {blunt: 10, bleed: 10, pierce: 10},
			turncap: scalar.radians.from.degrees(360),
		},
		stab: {
			timing: {windup: 1, release: 2, combo: 3, recovery: 4},
			damage: {blunt: 10, bleed: 10, pierce: 10},
			turncap: scalar.radians.from.degrees(360),
		},
		parry: {
			timing: {block: 1, recovery: 1, shieldRecovery: 1},
			turncap: scalar.radians.from.degrees(360),
		},
	}
}

export const middleOf = (() => {
	const weapon = setupWeapon()
	const {windup, release, combo, recovery} = weapon.swing.timing
	return {
		windup: windup / 2,
		release: windup + (release / 2),
		combo: windup + release + (combo / 2),
		recovery: windup + release + (recovery / 2),
	}
})()

export function setupActivity(seconds = 0): Activity.Melee {
	return {
		kind: "melee",
		weapon: setupWeapon(),
		seconds,
		cancelled: null,
		maneuvers: [{
			angle: scalar.radians.from.degrees(90),
			technique: "swing",
			comboable: true,
		}],
	}
}

export function quickReport(seconds: number) {
	return new MeleeReport(setupActivity(seconds))
}

