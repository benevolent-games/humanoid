
import {scalar} from "@benev/toolbox"

import {meleeReport} from "../melee.js"
import {Activity, Maneuver} from "../../exports.js"
import {Weapon} from "../../../armory/weapon.js"

export const exampleTimings = {windup: 1, release: 2, combo: 3, recovery: 4}
// export const exampleManeuverDuration = 1 + 2 + 4

export function setupWeapon(): Weapon.Loadout {
	return {
		name: "axe",
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

export const times = (() => {
	const weapon = setupWeapon()
	const {windup, release, combo, recovery} = weapon.swing.timing
	return {
		windupMiddle: windup * 0.5,
		windupEnd: windup * 0.95,
		releaseMiddle: windup + (release * 0.5),
		releaseEnd: windup + release,
		comboMiddle: windup + release + (combo * 0.5),
		recoveryEarly: windup + release + (recovery * 0.1),
		recoveryMiddle: windup + release + (recovery * 0.5),
		recoveryLate: windup + release + (recovery * 0.9),
		recoveryEnd: windup + release + recovery,
	}
})()

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

