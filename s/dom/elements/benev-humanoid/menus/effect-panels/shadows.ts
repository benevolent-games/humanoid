
import {css, html} from "@benev/slate"
import {NuiCheckbox, NuiRange, NuiSelect} from "@benev/toolbox"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

import {InputGroup} from "./parts/types.js"
import {nexus} from "../../../../../nexus.js"
import {Ui} from "../../../../../models/ui/ui.js"
import {Granularity} from "../utils/granularity.js"
import {Game} from "../../../../../models/realm/types.js"
import {renderInputGroup} from "./parts/render-input-group.js"

const lightInputs: InputGroup<Ui["shadows"]["light"]> = {
	intensity: [Number, Granularity.coarse],
	autoUpdateExtends: [Boolean],
	autoCalcShadowZBounds: [Boolean],
	shadowMinZ: [Number, Granularity.bigly],
	shadowMaxZ: [Number, Granularity.bigly],
	shadowOrthoScale: [Number, Granularity.fine],
	shadowFrustumSize: [Number, Granularity.fine],
}

const generatorInputs: InputGroup<Ui["shadows"]["generator"]> = {
	enableSoftTransparentShadow: [Boolean],
	useKernelBlur: [Boolean],
	forceBackFacesOnly: [Boolean],
	mapSize: [Number, Granularity.square],
	blurScale: [Number, Granularity.medium],
	blurKernel: [Number, Granularity.medium],
	blurBoxOffset: [Number, Granularity.medium],
	contactHardeningLightSizeUVRatio: [Number, Granularity.medium],
	bias: [Number, Granularity.ultrafine],
	darkness: [Number, Granularity.fine],
	depthScale: [Number, Granularity.coarse],
	frustumEdgeFalloff: [Number, Granularity.fine],
}

const cascadedInputs: InputGroup<Ui["shadows"]["cascaded"]> = {
	enabled: [Boolean],
	debug: [Boolean],
	stabilizeCascades: [Boolean],
	freezeShadowCastersBoundingInfo: [Boolean],
	autoCalcDepthBounds: [Boolean],
	numCascades: [Number, new Granularity(0, 10, 1)],
	lambda: [Number, Granularity.fine],
	cascadeBlendPercentage: [Number, Granularity.fine],
	penumbraDarkness: [Number, Granularity.fine],
	shadowMinZ: [Number, Granularity.bigly],
	shadowMaxZ: [Number, Granularity.bigly],
}

class Flags<N extends number, S extends string> {
	strings: Map<N, S>
	numbers: Map<S, N>
	constructor(entries: [N, S][]) {
		this.strings = new Map(entries)
		this.numbers = new Map(entries.map(([number, string]) => [string, number]))
	}
	toString(number: N) { return this.strings.get(number)! }
	toNumber(string: S) { return this.numbers.get(string)! }
}

type FQNumber = 0 | 1 | 2
type FQString = "low" | "medium" | "high"
const filteringQualityFlags = new Flags<FQNumber, FQString>([
	[ShadowGenerator.QUALITY_LOW, "low"],
	[ShadowGenerator.QUALITY_MEDIUM, "medium"],
	[ShadowGenerator.QUALITY_HIGH, "high"],
])

type FNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
type FString = "none" | "exponential" | "poisson" | "blurExponential" | "closeExponential" | "blurCloseExponential" | "pcf" | "pcss"
const filterFlags = new Flags<FNumber, FString>([
	[ShadowGenerator.FILTER_NONE, "none"],
	[ShadowGenerator.FILTER_EXPONENTIALSHADOWMAP, "exponential"],
	[ShadowGenerator.FILTER_POISSONSAMPLING, "poisson"],
	[ShadowGenerator.FILTER_BLUREXPONENTIALSHADOWMAP, "blurExponential"],
	[ShadowGenerator.FILTER_CLOSEEXPONENTIALSHADOWMAP, "closeExponential"],
	[ShadowGenerator.FILTER_BLURCLOSEEXPONENTIALSHADOWMAP, "blurCloseExponential"],
	[ShadowGenerator.FILTER_PCF, "pcf"],
	[ShadowGenerator.FILTER_PCSS, "pcss"],
])

export const ShadowsPanel = nexus.shadow_view(use => (game: Game) => {
	use.name("shadows-panel")
	use.styles(css`
		.panel {
			> * + * { margin-top: 1em; }
			> section {
				padding: 1em;
				background: #0002;
				> * + * { display: block; margin-top: 0.6em; }
			}
		}
		h2 { color: white; text-align: center; }
		h3 { color: #89ff91; }
	`)

	const {shadows} = game.ui

	return html`
		<section class=panel>
			<h2>shadows</h2>

			<section>
				<h3>basics</h3>
				${NuiSelect([{
					label: "filter",
					options: [...filterFlags.strings.values()],
					selected: filterFlags.toString(shadows.basics.filter as FNumber),
					set: x => shadows.basics.filter = filterFlags.toNumber(x as FString),
				}])}
				${NuiSelect([{
					label: "filteringQuality",
					options: [...filteringQualityFlags.strings.values()],
					selected: filteringQualityFlags.toString(shadows.basics.filteringQuality as FQNumber),
					set: x => shadows.basics.filteringQuality = filteringQualityFlags.toNumber(x as FQString),
				}])}
				${NuiRange([{
					...Granularity.bigly,
					label: "sunDistance",
					value: shadows.basics.sunDistance,
					set: x => shadows.basics.sunDistance = x,
				}])}
				${NuiCheckbox([{
					label: "grass_receives_shadows",
					checked: shadows.basics.grass_receives_shadows,
					set: x => shadows.basics.grass_receives_shadows = x,
				}])}
				${NuiCheckbox([{
					label: "grass_casts_shadows",
					checked: shadows.basics.grass_casts_shadows,
					set: x => shadows.basics.grass_casts_shadows = x,
				}])}
			</section>

			<section>
				<h3>light</h3>
				${renderInputGroup(shadows.light, lightInputs)}
			</section>

			<section>
				<h3>generator</h3>
				${renderInputGroup(shadows.generator, generatorInputs)}
			</section>

			<section>
				<h3>cascaded</h3>
				${renderInputGroup(shadows.cascaded, cascadedInputs)}
			</section>
		</section>
	`
})

