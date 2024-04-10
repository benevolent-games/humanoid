
import {Pojo} from "@benev/slate"
import {Weapon} from "./weapon.js"

const ms = (ms: number) => ms / 1000
const percent = (percent: number) => percent * 1000

const weapon = {
	grips: (grips: Weapon.Grips) => grips,
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
						windup: ms(windup),
						release: ms(release - (release / 2)),
						recovery: ms(recovery + (release / 2)),
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

	adze: weapon.grips({
		onehander: timings(400, 500, 400).damage(40, 20, 0).stab(10, 0, 0),
	}),

	hammer: weapon.grips({
		onehander: timings(500, 500, 400).damage(40, 0, 50).stab(10, 0, 0),
	}),

	mace: weapon.grips({
		onehander: timings(400, 500, 500).damage(50, 0, 60).stab(10, 0, 0),
	}),

	hatchet: weapon.grips({
		onehander: timings(400, 500, 400).damage(40, 40, 30).stab(10, 0, 0),
	}),

	axe: weapon.grips({
		twohander: timings(500, 600, 500).damage(60, 60, 60).stab(20, 0, 0),
		onehander: timings(600, 600, 700).damage(40, 40, 40).stab(10, 0, 0),
	}),

	longsword: weapon.grips({
		twohander: timings(500, 600, 400).damage(10, 90, 0).stab(20, 40, 80),
		onehander: timings(600, 600, 600).damage(60, 40, 40).stab(10, 40, 80),
	}),

	sledgehammer: weapon.grips({
		twohander: timings(800, 600, 900).damage(90, 0, 90).stab(20, 0, 80),
	}),

} satisfies Pojo<Weapon.Grips>

