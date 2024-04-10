
import {scalar} from "@benev/toolbox"
import {Weapon} from "../weapon.js"

export const weapon = {
	grips: (grips: Weapon.Grips) => grips,
	dualgrip: {
		naturallyOneHanded: (details: Weapon.Details): Weapon.Grips => ({
			onehander: details,

			// using a one-hander with two-hands. (it's a fair tradeoff)
			twohander: multipliers(details)
				.timing(1.1) // a little slower.
				.turncap(0.5) // less maneuverable.
				.damage(1.1), // a little more power.
		}),
		naturallyTwoHanded: (details: Weapon.Details): Weapon.Grips => ({
			twohander: details,

			// attempting to use a two-hander with one-hand. (it performs badly)
			onehander: (() => {
				const clone = multipliers(details)
					.timing(1.0) // timing customized below.
					.turncap(0.5) // terrible maneuverability.
					.damage(0.8) // less damage.

				// timing customized to be bad in a special way.
				clone.swing.timing.windup *= 1.4 // windup is bad.
				clone.swing.timing.release *= 1.1
				clone.swing.timing.recovery *= 2.0 // recovery is horrible!

				clone.stab.timing.windup *= 1.2 // stab windup only mildly bad.
				clone.stab.timing.release *= 1.1
				clone.stab.timing.recovery *= 2.0 // recovery is horrible!

				return clone
			})(),
		}),
	},
}

/**
 * timings in milliseconds.
 * "swing" timings are provided, and we derive stab timings from that,
 * because there is a common patternt to how stab timings are different.
 */
export const timings = (windup: number, release: number, recovery: number) => ({

	/**
	 * these inputs are measured in degrees per second.
	 * turncaps are limits on how fast a player can spin around,
	 * which we may apply while a player is swinging a sword.
	 */
	turncap: (turncap: number | null) => ({

		/**
		 * these inputs are health percentages.
		 * damages are provided for swing and stab separately.
		 */
		damage: (blunt1: number, bleed1: number, pierce1: number) => ({

			/** also measured in health percentages. */
			stab: (blunt2: number, bleed2: number, pierce2: number): Weapon.Details => {
				return {

					// standard parry window for all weapons, keeps players sane.
					parry: {
						turncap: turncap === null ? null : scalar.radians.from.degrees(turncap * 3),
						timing: {block: ms(400), recovery: ms(1000), shieldRecovery: ms(500)},
					},

					swing: {
						turncap: turncap === null ? null : scalar.radians.from.degrees(turncap),
						timing: {windup: ms(windup), release: ms(release), recovery: ms(recovery)},
						damage: {blunt: percent(blunt1), bleed: percent(bleed1), pierce: percent(pierce1)},
					},
					stab: {
						turncap: turncap === null ? null : scalar.radians.from.degrees(turncap),
						damage: {blunt: percent(blunt2), bleed: percent(bleed2), pierce: percent(pierce2)},
						timing: {
							windup: ms(windup + (release / 3)), // stabs have slower windup,
							release: ms(release - (release / 3)), // but faster release (total attack time is same).
							recovery: ms(recovery),
						},
					},
				}
			},
		}),
	}),
})

////////////////////////////////////////////
////////////////////////////////////////////

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
	timing: (timing: number) => ({
		turncap: (turncap: number) => ({
			damage: (damage: number) => {
				const clone = structuredClone(weapon)

				clone.swing.timing = xTiming(clone.swing.timing, timing)
				clone.swing.damage = xDamage(clone.swing.damage, damage)
				clone.stab.timing = xTiming(clone.stab.timing, timing)
				clone.stab.damage = xDamage(clone.stab.damage, damage)

				if (clone.parry.turncap) clone.parry.turncap *= turncap
				if (clone.swing.turncap) clone.swing.turncap *= turncap
				if (clone.stab.turncap) clone.stab.turncap *= turncap

				return clone
			},
		}),
	}),
})

