
import {Suite, expect} from "cynic"
import {scalar} from "@benev/toolbox"

import {Activity} from "../exports.js"
import {Weapon} from "../../armory/weapon.js"

export default <Suite>{
	"test": async() => {
		const activity = setupActivity()
		expect(activity).ok()
	},
}

///////////////////////////////
///////////////////////////////

function setupWeapon(): Weapon.Loadout {
	return {
		name: "axe",
		stab: {
			timing: {windup: 1, release: 1, combo: 1, recovery: 1},
			damage: {blunt: 10, bleed: 10, pierce: 10},
			turncap: scalar.radians.from.degrees(360),
		},
		swing: {
			timing: {windup: 1, release: 1, combo: 1, recovery: 1},
			damage: {blunt: 10, bleed: 10, pierce: 10},
			turncap: scalar.radians.from.degrees(360),
		},
		parry: {
			timing: {block: 1, recovery: 1, shieldRecovery: 1},
			turncap: scalar.radians.from.degrees(360),
		},
	}
}

function setupActivity(): Activity.Melee {
	return {
		kind: "melee",
		weapon: setupWeapon(),
		seconds: 0,
		cancelled: null,
		maneuvers: [{
			angle: scalar.radians.from.degrees(90),
			technique: "swing",
			comboable: true,
		}],
	}
}

