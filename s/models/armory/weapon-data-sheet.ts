
import {Pojo} from "@benev/slate"
import {Weapon} from "./weapon.js"

const ms = (ms: number) => ms / 1000
const percent = (percent: number) => percent * 1000

const xTiming = (t: Weapon.AttackTiming, x: number): Weapon.AttackTiming => ({
	windup: t.windup * x,
	release: t.release * x,
	recovery: t.recovery * x,
})

const xDamage = (d: Weapon.Damage, x: number): Weapon.Damage => ({
	blunt: d.blunt * x,
	bleed: d.bleed * x,
	pierce: d.pierce * x,
})

const multipliers = (weapon: Weapon.Details) => ({
	timing: (x: number) => ({
		damage: (y: number) => {
			const clone = structuredClone(weapon)
			clone.swing.timing = xTiming(clone.swing.timing, x)
			clone.swing.damage = xDamage(clone.swing.damage, y)
			clone.stab.timing = xTiming(clone.stab.timing, x)
			clone.stab.damage = xDamage(clone.stab.damage, y)
			return clone
		},
	}),
})

const weapon = {
	grips: (grips: Weapon.Grips) => grips,
	dualgrip: {
		naturallyOneHanded: (details: Weapon.Details): Weapon.Grips => ({
			onehander: details,
			twohander: multipliers(details)
				.timing(1.1) // a little slower
				.damage(1.1), // a little more damage
		}),
		naturallyTwoHanded: (details: Weapon.Details): Weapon.Grips => ({
			twohander: details,
			onehander: (() => {
				const clone = multipliers(details)
					.timing(1.0)
					.damage(0.8) // less damage

				// timing customized to be bad in a special way
				clone.swing.timing.windup *= 1.4 // windup is bad
				clone.swing.timing.release *= 1.1
				clone.swing.timing.recovery *= 2.0 // recovery is horrible

				clone.stab.timing.windup *= 1.2 // stab windup only mildly bad
				clone.stab.timing.release *= 1.1
				clone.stab.timing.recovery *= 2.0 // recovery is horrible

				return clone
			})(),
		}),
	},
}

const timings = (windup: number, release: number, recovery: number) => ({
	damage: (blunt1: number, bleed1: number, pierce1: number) => ({
		stab: (blunt2: number, bleed2: number, pierce2: number): Weapon.Details => {
			return {
				parry: {timing: {block: ms(500), recovery: ms(500)}},
				swing: {
					timing: {windup: ms(windup), release: ms(release), recovery: ms(recovery)},
					damage: {blunt: percent(blunt1), bleed: percent(bleed1), pierce: percent(pierce1)},
				},
				stab: {
					damage: {blunt: percent(blunt2), bleed: percent(bleed2), pierce: percent(pierce2)},
					timing: {
						windup: ms(windup + (release / 3)),
						release: ms(release - (release / 3)),
						recovery: ms(recovery),
					},
				},
			}
		},
	}),
})

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

