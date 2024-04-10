
import {Pojo} from "@benev/slate"
import {Weapon} from "./weapon.js"
import {timings, weapon} from "./utils/weapon-helpers.js"

export const weaponDataSheet = {

	fists: weapon.grips({
		fists: timings(300, 500, 300).damage(10, 0, 0).stab(5, 0, 0),
	}),

	adze: weapon.dualgrip.naturallyOneHanded(
		timings(400, 500, 400).damage(40, 20, 0).stab(10, 0, 0),
	),

	hammer: weapon.dualgrip.naturallyOneHanded(
		timings(500, 500, 400).damage(40, 0, 50).stab(10, 0, 0),
	),

	mace: weapon.dualgrip.naturallyOneHanded(
		timings(400, 500, 500).damage(50, 0, 60).stab(10, 0, 0),
	),

	hatchet: weapon.dualgrip.naturallyOneHanded(
		timings(400, 500, 400).damage(40, 40, 30).stab(10, 0, 0),
	),

	axe: weapon.dualgrip.naturallyTwoHanded(
		timings(500, 600, 500).damage(60, 60, 60).stab(20, 0, 0),
	),

	longsword: weapon.dualgrip.naturallyTwoHanded(
		timings(500, 600, 400).damage(10, 90, 0).stab(20, 40, 80),
	),

	sledgehammer: weapon.dualgrip.naturallyTwoHanded(
		timings(800, 600, 900).damage(90, 0, 90).stab(20, 0, 80),
	),

} satisfies Pojo<Weapon.Grips>

