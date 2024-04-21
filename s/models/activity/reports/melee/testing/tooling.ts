
import {scalar} from "@benev/toolbox"

import {meleeReport} from "../melee-report.js"
import {Weapon} from "../../../../armory/weapon.js"
import {Activity, Maneuver} from "../../../exports.js"

export const exampleTimings = {windup: 1, release: 1, combo: 1, recovery: 1, bounce: 1}

export function setupWeapon(): Weapon.Loadout {
	return {
		name: "axe",
		gripPoint: 0,
		swing: {
			timing: exampleTimings,
			damage: {blunt: 10, bleed: 10, pierce: 10},
			turncap: scalar.radians.from.degrees(360),
		},
		stab: {
			timing: exampleTimings,
			damage: {blunt: 10, bleed: 10, pierce: 10},
			turncap: scalar.radians.from.degrees(360),
		},
		parry: {
			timing: {block: 1, recovery: 1, shieldRecovery: 1},
			turncap: scalar.radians.from.degrees(360),
		},
	}
}

export function quickManeuver(): Maneuver.Swing {
	return {
		technique: "swing",
		angle: scalar.radians.from.degrees(90),
		comboable: true,
	}
}

export function setupActivity(seconds = 0): Activity.Melee {
	return {
		kind: "melee",
		weapon: setupWeapon(),
		seconds,
		cancelled: null,
		maneuvers: [quickManeuver()],
	}
}

export function quickReport(seconds: number) {
	return meleeReport(setupActivity(seconds))
}

