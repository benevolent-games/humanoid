
import {clone, css, html, reactor} from "@benev/slate"
import {NuiCheckbox, NuiRange, Bestorage, NuiSelect} from "@benev/toolbox"

import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"
import {HuBestorageData} from "../effects.js"
import {Ui} from "../../../../../models/ui/ui.js"
import {Granularity} from "../utils/granularity.js"
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

type Primitive = number | boolean

type InputGroup<G extends Record<string, Primitive>> = {
	[K in keyof G]: (
		G[K] extends number ? [typeof Number, Granularity] :
		G[K] extends boolean ? [typeof Boolean] :
		never
	)
}

const lightInputs: InputGroup<Ui["shadows"]["light"]> = {
	autoUpdateExtends: [Boolean],
	autoCalcShadowZBounds: [Boolean],
	shadowMaxZ: [Number, Granularity.bigly],
	shadowMinZ: [Number, Granularity.bigly],
	shadowOrthoScale: [Number, Granularity.fine],
	shadowFrustumSize: [Number, Granularity.fine],
}

const generatorInputs: InputGroup<Ui["shadows"]["generator"]> = {
	usePoissonSampling: [Boolean],
	useExponentialShadowMap: [Boolean],
	useBlurExponentialShadowMap: [Boolean],
	useCloseExponentialShadowMap: [Boolean],
	useBlurCloseExponentialShadowMap: [Boolean],
	usePercentageCloserFiltering: [Boolean],
	useContactHardeningShadow: [Boolean],
	enableSoftTransparentShadow: [Boolean],
	useKernelBlur: [Boolean],
	forceBackfacesOnly: [Boolean],
	mapSize: [Number, Granularity.square],
	blurScale: [Number, Granularity.medium],
	blurKernel: [Number, Granularity.medium],
	blurBoxOffset: [Number, Granularity.medium],
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
}

function renderInputGroup<Data extends Record<string, Primitive>>(data: Data, group: InputGroup<Data>) {
	return Object.entries(group).map(([key, spec]) => {
		const [kind] = spec
		const value = data[key] as any
		const set = (x: any) => (data as any)[key] = x
		if (kind === Boolean) {
			return NuiCheckbox([{
				label: key,
				checked: value,
				set: x => {
					console.log("boolean", key, x, clone(data))
					;(data as any)[key] = x
					console.log("----", key, x, clone(data))
				},
			}])
		}
		else if (kind === Number) {
			const granularity = spec[1]!
			return NuiRange([{
				...granularity,
				label: key,
				value,
				set,
			}])
		}
		else throw new Error("unknown group kind")
	})
}

type QString = "low" | "medium" | "high"
type QNumber = 0 | 1 | 2

class FilteringQuality {
	static strings = new Map<QNumber, QString>([
		[ShadowGenerator.QUALITY_LOW, "low"],
		[ShadowGenerator.QUALITY_MEDIUM, "medium"],
		[ShadowGenerator.QUALITY_HIGH, "high"],
	])

	static numbers = new Map<QString, QNumber>(
		[...this.strings].map((([number, string]) => [string, number]))
	)

	static toString(number: QNumber) {
		return this.strings.get(number)!
	}

	static toNumber(string: QString) {
		return this.numbers.get(string)!
	}
}

export const ShadowsPanel = nexus.shadow_view(use => (game: Game, bestorage: Bestorage<HuBestorageData>) => {
	use.name("shadows-panel")
	use.styles(css`
		.panel {
			> * + * { margin-top: 1em; }
			> section {
				padding: 1em;
				background: #0002;
				> * + * { margin-top: 0.6em; }
			}
		}
		h2 { color: white; text-align: center; }
		h3 { color: #89ff91; }
	`)

	use.mount(() => reactor.reaction(
		() => clone(game.ui.shadows),
		shadows => bestorage.data.shadows = shadows,
	))

	use.mount(() => bestorage.onJson(({shadows}) => {
		Object.assign(game.ui.shadows.basics, shadows.basics)
		Object.assign(game.ui.shadows.light, shadows.light)
		Object.assign(game.ui.shadows.generator, shadows.generator)
		Object.assign(game.ui.shadows.cascaded, shadows.cascaded)
	}))

	return html`
		<section class=panel>
			<h2>shadows</h2>

			<section>
				<h3>basics</h3>
				${NuiRange([{
					...Granularity.bigly,
					label: "sunDistance",
					value: game.ui.shadows.basics.sunDistance,
					set: x => game.ui.shadows.basics.sunDistance = x,
				}])}
				${NuiSelect([{
					label: "filteringQuality",
					options: [...FilteringQuality.strings.values()],
					selected: FilteringQuality.toString(game.ui.shadows.basics.filteringQuality as QNumber),
					set: x => game.ui.shadows.basics.filteringQuality = FilteringQuality.toNumber(x as QString),
				}])}
			</section>

			<section>
				<h3>light</h3>
				${renderInputGroup(game.ui.shadows.light, lightInputs)}
			</section>

			<section>
				<h3>generator</h3>
				${renderInputGroup(game.ui.shadows.generator, generatorInputs)}
			</section>

			<section>
				<h3>cascaded</h3>
				${renderInputGroup(game.ui.shadows.cascaded, cascadedInputs)}
			</section>
		</section>
	`
})

