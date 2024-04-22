
import {Ecs} from "@benev/toolbox"
import {flatstate} from "@benev/slate"
import {Weapon} from "../armory/weapon.js"
import {Activity} from "../activity/exports.js"
import {HealthState, Sensitivity} from "./types.js"
import {MeleeAim} from "../../ecs/components/topics/warrior.js"

export class Ui {
	sensitivity: Sensitivity = flatstate({
		mouse: 360,
		keys: 180,
		stick: 180,
		touch: 1440,
	})

	debug = flatstate({
		meleeTracers: false,
	})

	reticle = flatstate({
		enabled: false,
		size: 1,
		opacity: 0.4,
		data: null as null | {
			meleeAim: null | Ecs.ComponentState<MeleeAim>
			activity: null | Activity.Any
		}
	})

	personalHealth: HealthState = flatstate({
		enabled: false,
		hp: 0,
		bleed: 0,
		stamina: 0,
	})

	targetHealth: HealthState = flatstate({
		...this.personalHealth,
	})

	equipment = flatstate({
		enabled: false,
		shield: false,
		weaponName: "",
		grips: {
			fists: flatstate({
				available: false,
				active: false,
			}),
			twohander: flatstate({
				available: false,
				active: false,
			}),
			onehander: flatstate({
				available: false,
				active: false,
			}),
		} satisfies Record<Weapon.Grip, any>
	})

	shadows = flatstate({
		sunDistance: 100,

		generator: flatstate({
			usePoissonSampling: false,
			useExponentialShadowMap: false,
			useBlurExponentialShadowMap: false,
			// useContactHardeningShadow: false,
			useContactHardeningShadow: true,
			enableSoftTransparentShadow: false,
			useCloseExponentialShadowMap: false,
			useKernelBlur: false,
			// mapSize: 1024,
			mapSize: 2048,
			blurScale: 2,
			blurKernel: 1,
			blurBoxOffset: 1,
			bias: 50 / 1_000_000,
			darkness: 0,
			depthScale: 50,
		}),
	})
}

