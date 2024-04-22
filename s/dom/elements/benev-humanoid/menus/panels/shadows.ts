
import {clone, css, html, reactor} from "@benev/slate"
import {NuiCheckbox, NuiRange, Bestorage} from "@benev/toolbox"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

import {Game} from "../../../../../types.js"
import {nexus} from "../../../../../nexus.js"
import {HuBestorageData} from "../effects.js"
import {Granularity} from "../utils/granularity.js"

const shadowBooleans: (keyof ShadowGenerator)[] = [
	"usePoissonSampling",
	"useExponentialShadowMap",
	"useBlurExponentialShadowMap",
	"useContactHardeningShadow",
	"enableSoftTransparentShadow",
	"useCloseExponentialShadowMap",
	"useKernelBlur",
]

const shadowNumber: [keyof ShadowGenerator, Granularity][] = [
	["mapSize", Granularity.square],
	["blurScale", Granularity.medium],
	["blurKernel", Granularity.medium],
	["blurBoxOffset", Granularity.medium],
	["bias", Granularity.ultrafine],
	["darkness", Granularity.fine],
	["depthScale", Granularity.coarse],
]

export const ShadowsPanel = nexus.shadow_view(use => (game: Game, bestorage: Bestorage<HuBestorageData>) => {
	use.name("shadows-panel")
	use.styles(css``)

	use.mount(() => reactor.reaction(
		() => clone(game.ui.shadows),
		shadows => bestorage.data.shadows = shadows,
	))

	use.mount(() => bestorage.onJson(({shadows}) => {
		game.ui.shadows.sunDistance = shadows.sunDistance
		Object.assign(game.ui.shadows.generator, shadows.generator)
	}))

	const get = (key: any) => (game.ui.shadows.generator as any)[key]
	const set = (key: any, value: any) => (game.ui.shadows.generator as any)[key] = value

	return html`
		<section>
			<h3>shadow settings</h3>

			${NuiRange([{
				...Granularity.bigly,
				label: "sunDistance",
				value: game.ui.shadows.sunDistance,
				set: x => game.ui.shadows.sunDistance = x,
			}])}

			${shadowBooleans.map(key => NuiCheckbox([{
				label: key,
				checked: get(key),
				set: x => set(key, x),
			}]))}

			${shadowNumber.map(([key, granularity]) => NuiRange([{
				...granularity,
				label: key,
				value: get(key),
				set: x => set(key, x),
			}]))}
		</section>
	`
})

