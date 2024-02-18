
import {TemplateResult, clone, debounce, html, reactor, ob, flat} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Toggler} from "./parts/toggler.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {Effects, NuiCheckbox, NuiRange, Rendering} from "@benev/toolbox"

export const Panel = nexus.shadow_view(use => (realm: HumanoidRealm) => {
	use.name("panel")
	use.styles(styles)

	const resolution = use.signal(realm.porthole.resolution * 100)
	const {effects, active} = use.once(() => {
		const std = Rendering.effects.everything()
		const effects = ob(std).map(effect => flat.state(effect)) as Effects
		const active = flat.state(ob(std).map(() => false))
		return {effects, active}
	})

	function collect() {
		const copy = clone(effects) as Partial<Effects>
		for (const [key, value] of Object.entries(active))
			if (value === false)
				copy[key as keyof typeof copy] = undefined
		return copy
	}

	const json = use.signal(JSON.stringify(collect()))

	const apply_the_effects = use.once(() => debounce(500, (effects: Partial<Effects>) => {
		json.value = JSON.stringify(effects)
		realm.stage.rendering.setEffects(effects)
	}))

	use.mount(() => reactor.reaction(
		collect,
		apply_the_effects,
	))

	use.mount(() => reactor.reaction(
		() => realm.porthole.resolution = resolution.value / 100)
	)

	const wrap = (t: TemplateResult) => html`
		${Toggler(() => html`
			<div class=panel>
				<div class=content>
					${t}
				</div>
			</div>
		`)}
	`

	type Granularity = {
		min: number
		max: number
		step: number
	}
	type Group = {[key: string]: number | boolean | string}
	type NumSpec<G extends Group> = {
		[K in keyof G as G[K] extends number ? K : never]: Granularity
	}

	const granularity = {
		samples: {min: 0, max: 64, step: 2},
		bigSamples: {min: 0, max: 512, step: 8},
		integer: {min: 0, max: 100, step: 1},
		superfine: {min: 0, max: .2, step: .001},
		fine: {min: 0, max: 1, step: .01},
		medium: {min: 0, max: 10, step: .1},
		coarse: {min: 0, max: 100, step: 1},
		coarser: {min: 0, max: 1000, step: 10},
		giant: {min: 0, max: 5_000, step: 10},
	} satisfies Record<string, Granularity>

	function settings<G extends Group>(group: G) {
		return (spec: NumSpec<G>) => {
			return Object.entries(group).map(([key, value]) => {
				if (typeof value === "number") {
					const granularity = spec[key as keyof typeof spec] as Granularity
					return NuiRange([{
						...granularity,
						label: key,
						value,
						set: x => (group as any)[key] = x,
					}])
				}
				else if (typeof value === "boolean") {
					return NuiCheckbox([{
						label: key,
						checked: value,
						set: x => (group as any)[key] = x,
					}])
				}
				else if (typeof value === "string") {
					return html`<span>TODO dropdown</span>`
				}
				else throw new Error(`invalid setting "${key}"`)
			})
		}
	}

	function render_section<G extends Group>(
			activeKey: keyof typeof active,
			group: G,
			docs?: TemplateResult,
		) {
		return (spec: NumSpec<G>) => html`
			<header ?data-active="${active[activeKey]}">
				${NuiCheckbox([{
					label: activeKey,
					checked: active[activeKey],
					set: x => active[activeKey] = x,
				}])}
				${docs}
			</header>
			<section class=group ?data-hidden="${!active[activeKey]}">
				${settings(group)(spec)}
			</section>
		`
	}

	function handle_json_change(event: InputEvent) {
		const textarea = event.currentTarget as HTMLTextAreaElement
		const newEffects = JSON.parse(textarea.value.trim()) as Partial<Effects>
		for (const [k, group] of Object.entries(newEffects)) {
			const key = k as keyof Effects
			active[key] = !!group
			if (group)
				Object.assign(effects[key], group)
		}
		apply_the_effects(newEffects)
	}

	return wrap(html`
		<article>
			<header>data</header>
			<textarea @change="${handle_json_change}" .value="${json}"></textarea>
		</article>

		<article>
			<header>general</header>
			<section>
				${NuiRange([{
					label: "resolution",
					min: 5, max: 100, step: 5,
					value: resolution.value,
					set: x => resolution.value = x,
				}])}
			</section>
		</article>

		<article>
			${render_section("ssao", effects.ssao, html`
					<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.SSAO2RenderingPipeline">ref</a>
				`)({
				ssaoRatio: granularity.medium,
				blurRatio: granularity.medium,
				totalStrength: granularity.medium,
				base: granularity.medium,
				bilateralSamples: granularity.bigSamples,
				bilateralSoften: granularity.medium,
				bilateralTolerance: granularity.medium,
				maxZ: granularity.giant,
				minZAspect: granularity.coarse,
				radius: granularity.medium,
				epsilon: granularity.fine,
				samples: granularity.samples,
			})}

			${render_section("ssr", effects.ssr, html`
					<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/SSRRenderingPipeline">docs</a>
					<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.SSRRenderingPipeline">ref</a>
				`)({
				maxDistance: granularity.giant,
				maxSteps: granularity.coarser,
				reflectionSpecularFalloffExponent: granularity.medium,
				roughnessFactor: granularity.fine,
				strength: granularity.medium,
				blurDispersionStrength: granularity.fine,
				reflectivityThreshold: granularity.superfine,
				blurDownsample: granularity.medium,
				ssrDownsample: granularity.medium,
				samples: granularity.coarse,
				step: granularity.medium,
				thickness: granularity.medium,
				selfCollisionNumSkip: granularity.medium,
				backfaceDepthTextureDownsample: granularity.medium,
			})}

			${render_section("lens", effects.lens)({
				chromatic_aberration: granularity.fine,
				edge_blur: granularity.fine,
				distortion: granularity.fine,
				grain_amount: granularity.fine,
				dof_focus_distance: granularity.coarse,
				dof_aperture: granularity.medium,
				dof_darken: granularity.medium,
				dof_gain: granularity.medium,
				dof_threshold: granularity.medium,
			})}

			${render_section("antialiasing", effects.antialiasing)({
				samples: granularity.samples,
			})}

			${render_section("imageProcessing", effects.imageProcessing)({
				contrast: granularity.medium,
				exposure: granularity.medium,
			})}

			${render_section("tonemapping", effects.tonemapping)({})}

			${render_section("vignette", effects.vignette)({
			})}

			${render_section("bloom", effects.bloom)({
				weight: granularity.medium,
				threshold: granularity.fine,
				scale: granularity.medium,
				kernel: granularity.bigSamples,
			})}

			${render_section("chromaticAberration", effects.chromaticAberration)({
				aberrationAmount: granularity.coarse,
				radialIntensity: granularity.medium,
			})}

			${render_section("glow", effects.glow)({
				intensity: granularity.medium,
				blurKernelSize: granularity.samples,
			})}

			${render_section("sharpen", effects.sharpen)({
				colorAmount: granularity.medium,
				edgeAmount: granularity.medium,
			})}
		</article>
	`)
})

