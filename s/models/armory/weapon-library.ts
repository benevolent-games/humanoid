
import {Pojo, ob} from "@benev/slate"
import {Weapon} from "./weapon.js"
import { Vec3 } from "@benev/toolbox"

const ms = (ms: number) => ms / 1000
const percent = (percent: number) => percent * 1000


/** weapon timings in milliseconds */
const times = (windup: number, release: number, recovery: number): Weapon.Timings => ({
	parry: {block: ms(500), recovery: ms(500)},
	swing: {windup, release, recovery},
	stab: {
		windup,
		release: release - (release / 2),
		recovery: recovery + (release / 2)
	},
})

/** ribbons */
const shape = (x: number, y: number, z: number) => ({
	swing: (...swingRibbons: [Weapon.RibbonKind, Vec3, Vec3][]) => ({
		stab: (...stabRibbons: [Weapon.RibbonKind, Vec3, Vec3][]): Weapon.Shape => ({
			size: [x, y, z],
			swingRibbons: swingRibbons.map(([kind, a, b]) => ({kind, a, b})),
			stabRibbons: stabRibbons.map(([kind, a, b]) => ({kind, a, b})),
		}),
	}),
})

/** weapon damages in percentages */
const dmg = (blunt1: number, bleed1: number, pierce1: number) => ({
	stab: (blunt2: number, bleed2: number, pierce2: number): Weapon.Damages => ({
		swing: {blunt: percent(blunt1), bleed: percent(bleed1), pierce: percent(pierce1)},
		stab: {blunt: percent(blunt2), bleed: percent(bleed2), pierce: percent(pierce2)},
	}),
})

export const weaponLibrary = ob({

	fists: {
		grip: "fists",
		timings: times(300, 500, 300),
		damages: dmg(10, 0, 0).stab(5, 0, 0),
		shape: shape(0, .15, 0)
			.swing(["danger", [0, 0, 0], [0, 1, 0]])
			.stab(["danger", [0, 0, 0], [0, 1, 0]])
	},

	adze: {
		grip: "onehander",
		timings: times(400, 500, 400),
		damages: dmg(40, 20, 30).stab(10, 0, 0),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

	hammer: {
		grip: "onehander",
		timings: times(500, 500, 400),
		damages: dmg(40, 20, 30).stab(10, 0, 0),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

	mace: {
		grip: "onehander",
		timings: times(400, 500, 500),
		damages: dmg(40, 20, 30).stab(10, 0, 0),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

	hatchet: {
		grip: "onehander",
		timings: times(400, 500, 400),
		damages: dmg(40, 20, 30).stab(10, 0, 0),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

	axe: {
		grip: "onehander",
		timings: times(500, 600, 500),
		damages: dmg(40, 20, 30).stab(10, 0, 0),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

	longsword: {
		grip: "twohander",
		timings: times(500, 600, 400),
		damages: dmg(20, 50, 0).stab(20, 30, 40),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

	sledgehammer: {
		grip: "twohander",
		timings: times(800, 600, 800),
		damages: dmg(80, 0, 0).stab(20, 0, 80),
		shape: shape(.1, .8, .1)
			.swing(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			)
			.stab(
				["handle", [0, 0/8, 0], [0, 7/8, 0]],
				["danger", [0, 7/8, 0], [0, 8/8, 0]],
			),
	},

} satisfies Pojo<Weapon.Config>).map(
	(config, name): Weapon.Details => ({...config, name})
)

