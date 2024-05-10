
import {Ecs, Vec3} from "@benev/toolbox"
import {flatstate} from "@benev/slate"
import {Weapon} from "../armory/weapon.js"
import {Activity} from "../activity/exports.js"
import {HealthState, Sensitivity} from "./types.js"
import {MeleeAim} from "../../ecs/components/topics/warrior.js"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

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

	particleFog = flatstate({
		enabled: true,
		color1: [.3, .3, .3] as Vec3,
		color2: [.95, .95, .95] as Vec3,
		alpha: 0.25,
		count: 500,
		spinrate: 0.5,
	})

	shadows = {
		basics: flatstate({
			filter: ShadowGenerator.FILTER_NONE,
			filteringQuality: ShadowGenerator.QUALITY_LOW,
			sunDistance: 100,
			grass_receives_shadows: true,
			grass_casts_shadows: false,
		}),

		light: flatstate({
			intensity: 8,
			autoUpdateExtends: false,
			autoCalcShadowZBounds: false,
			shadowOrthoScale: 0.1,
			shadowFrustumSize: 0,
			shadowMinZ: 10,
			shadowMaxZ: 500,
		}),

		generator: flatstate({
			enableSoftTransparentShadow: false,
			useKernelBlur: false,
			forceBackFacesOnly: false,
			mapSize: 1024,
			blurScale: 2,
			blurKernel: 1,
			blurBoxOffset: 1,
			contactHardeningLightSizeUVRatio: 0.1,
			bias: 50 / 1_000_000,
			darkness: 0,
			depthScale: 50,
			frustumEdgeFalloff: 0,
		}),

		cascaded: flatstate({
			enabled: false,
			debug: false,
			stabilizeCascades: false,
			autoCalcDepthBounds: true,
			freezeShadowCastersBoundingInfo: true,
			numCascades: 4,
			lambda: 0.5,
			cascadeBlendPercentage: 0.05,
			penumbraDarkness: 1,
			shadowMinZ: 0.1,
			shadowMaxZ: 500,
		}),
	}
}

