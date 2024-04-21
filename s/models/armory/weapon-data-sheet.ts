
import {Pojo} from "@benev/slate"
import {Weapon} from "./weapon.js"
import {timings, weapon} from "./utils/weapon-helpers.js"

export const weaponDataSheet = {

	fists: weapon.fistgrip(
		timings(300, 500, 300).turncap(500).damage(10, 0, 0).stab(5, 0, 0),
	),

	adze: weapon.dualgrip(0, 8).naturallyOneHanded(
		timings(400, 500, 400).turncap(500).damage(10, 10, 0).stab(10, 0, 0),
	),

	hatchet: weapon.dualgrip(0, 8).naturallyOneHanded(
		timings(400, 500, 400).turncap(500).damage(20, 20, 20).stab(10, 0, 0),
	),

	mace: weapon.dualgrip(0, 8).naturallyOneHanded(
		timings(400, 500, 500).turncap(400).damage(40, 0, 30).stab(10, 0, 0),
	),

	hammer: weapon.dualgrip(0, 8).naturallyOneHanded(
		timings(500, 500, 400).turncap(400).damage(40, 0, 30).stab(10, 0, 0),
	),

	axe: weapon.dualgrip(25, 15).naturallyTwoHanded(
		timings(500, 600, 500).turncap(300).damage(40, 40, 60).stab(20, 0, 0),
	),

	longsword: weapon.dualgrip(17, 17).naturallyTwoHanded(
		timings(500, 600, 400).turncap(250).damage(5, 90, 0).stab(20, 40, 80),
	),

	sledgehammer: weapon.dualgrip(30, 15).naturallyTwoHanded(
		timings(800, 600, 900).turncap(150).damage(90, 0, 90).stab(20, 0, 20),
	),

} satisfies Pojo<Weapon.Grips>

