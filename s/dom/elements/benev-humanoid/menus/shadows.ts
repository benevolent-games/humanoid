
import {css, html} from "@benev/slate"
import {NuiCheckbox, NuiRange} from "@benev/toolbox"
import {ShadowGenerator} from "@babylonjs/core/Lights/Shadows/shadowGenerator.js"

import {Game} from "../../../../types.js"
import {nexus} from "../../../../nexus.js"
import {Granularity} from "./utils/granularity.js"

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

export const ShadowsMenu = nexus.shadow_view(use => (game: Game) => {
	use.name("shadows-menu")
	use.styles(css``)

	const get = (key: any) => (game.ui.shadows.generator as any)[key]
	const set = (key: any, value: any) => (game.ui.shadows.generator as any)[key] = value

	return html`
		<section>
			${NuiRange([{
				...Granularity.coarse,
				label: "sun position y-axis",
				value: game.ui.shadows.sunPositionY,
				set: x => game.ui.shadows.sunPositionY = x,
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

/*


*/

