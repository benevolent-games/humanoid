
import {TemplateResult, clone, debounce, html, reactor, ob, flat} from "@benev/slate"
import {Effects, NuiCheckbox, NuiColor, NuiRange, NuiSelect, Rendering} from "@benev/toolbox"

import {styles} from "./styles.js"
import {Meta} from "./parts/meta.js"
import {nexus} from "../../../nexus.js"
import {Toggler} from "./parts/toggler.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"

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

	function render_input<G extends Effects[keyof Effects]>(group: G) {
		return (metaGroup: Meta.Group<G>) => {
			const g = group as any
			return Object.entries(metaGroup).map(([key, meta]) => {
				const value = g[key]

				if (meta instanceof Meta.Number)
					return NuiRange([{
						...meta.granularity,
						label: key,
						value,
						set: x => g[key] = x,
					}])

				else if (meta instanceof Meta.Boolean)
					return NuiCheckbox([{
						label: key,
						checked: value,
						set: x => g[key] = x,
					}])

				else if (meta instanceof Meta.SelectString)
					return NuiSelect([{
						label: key,
						options: meta.options,
						selected: g[key],
						set: x => g[key] = x,
					}])

				else if (meta instanceof Meta.Color)
					return NuiColor([{
						label: key,
						initial_hex_color: "#000000",
						set: ({color}) => g[key] = color,
					}])

				else throw new Error(`invalid setting "${key}"`)
			})
		}
	}

	function render_section<G extends Effects[keyof Effects]>(
			activeKey: keyof typeof active,
			group: G,
			docs?: TemplateResult,
		) {
		return (metaGroup: Meta.Group<G>) => html`
			<header ?data-active="${active[activeKey]}">
				${NuiCheckbox([{
					label: activeKey,
					checked: active[activeKey],
					set: x => active[activeKey] = x,
				}])}
				${docs}
			</header>
			<section class=group ?data-hidden="${!active[activeKey]}">
				${render_input(group)(metaGroup)}
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
			${render_section("antialiasing", effects.antialiasing)({
				fxaa: Meta.boolean,
				samples: Meta.granularity.samples,
			})}

			${render_section("imageProcessing", effects.imageProcessing)({
				contrast: Meta.granularity.medium,
				exposure: Meta.granularity.medium,
			})}

			${render_section("tonemapping", effects.tonemapping)({
				operator: new Meta.SelectString([
					"Hable",
					"HejiDawson",
					"Reinhard",
					"Photographic",
				]),
			})}

			${render_section("vignette", effects.vignette)({
				color: Meta.color,
				weight: Meta.granularity.medium,
				multiply: Meta.boolean,
				stretch: Meta.granularity.coarse,
			})}

			${render_section("bloom", effects.bloom)({
				weight: Meta.granularity.medium,
				threshold: Meta.granularity.fine,
				scale: Meta.granularity.medium,
				kernel: Meta.granularity.bigSamples,
			})}

			${render_section("chromaticAberration", effects.chromaticAberration)({
				aberrationAmount: Meta.granularity.coarse,
				radialIntensity: Meta.granularity.medium,
			})}

			${render_section("glow", effects.glow)({
				intensity: Meta.granularity.medium,
				blurKernelSize: Meta.granularity.samples,
			})}

			${render_section("sharpen", effects.sharpen)({
				colorAmount: Meta.granularity.medium,
				edgeAmount: Meta.granularity.medium,
			})}

			${render_section("ssao", effects.ssao, html`
					<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.SSAO2RenderingPipeline">ref</a>
				`)({
				bypassBlur: Meta.boolean,
				expensiveBlur: Meta.boolean,
				ssaoRatio: Meta.granularity.medium,
				blurRatio: Meta.granularity.medium,
				totalStrength: Meta.granularity.medium,
				base: Meta.granularity.medium,
				bilateralSamples: Meta.granularity.bigSamples,
				bilateralSoften: Meta.granularity.medium,
				bilateralTolerance: Meta.granularity.medium,
				maxZ: Meta.granularity.giant,
				minZAspect: Meta.granularity.coarse,
				radius: Meta.granularity.medium,
				epsilon: Meta.granularity.fine,
				samples: Meta.granularity.integer,
			})}

			${render_section("ssr", effects.ssr, html`
					<a target=_blank href="https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/SSRRenderingPipeline">docs</a>
					<a target=_blank href="https://doc.babylonjs.com/typedoc/classes/BABYLON.SSRRenderingPipeline">ref</a>
				`)({
				debug: Meta.boolean,
				useFresnel: Meta.boolean,
				clipToFrustum: Meta.boolean,
				attenuateFacingCamera: Meta.boolean,
				attenuateScreenBorders: Meta.boolean,
				enableSmoothReflections: Meta.boolean,
				attenuateBackfaceReflection: Meta.boolean,
				attenuateIntersectionDistance: Meta.boolean,
				attenuateIntersectionIterations: Meta.boolean,
				enableAutomaticThicknessComputation: Meta.boolean,
				backfaceForceDepthWriteTransparentMeshes: Meta.boolean,
				maxDistance: Meta.granularity.giant,
				maxSteps: Meta.granularity.coarser,
				reflectionSpecularFalloffExponent: Meta.granularity.medium,
				roughnessFactor: Meta.granularity.fine,
				strength: Meta.granularity.medium,
				blurDispersionStrength: Meta.granularity.fine,
				reflectivityThreshold: Meta.granularity.superfine,
				blurDownsample: Meta.granularity.medium,
				ssrDownsample: Meta.granularity.medium,
				samples: Meta.granularity.coarse,
				step: Meta.granularity.medium,
				thickness: Meta.granularity.medium,
				selfCollisionNumSkip: Meta.granularity.medium,
				backfaceDepthTextureDownsample: Meta.granularity.medium,
			})}

			${render_section("lens", effects.lens)({
				blur_noise: Meta.boolean,
				dof_pentagon: Meta.boolean,
				chromatic_aberration: Meta.granularity.fine,
				edge_blur: Meta.granularity.fine,
				distortion: Meta.granularity.fine,
				grain_amount: Meta.granularity.fine,
				dof_focus_distance: Meta.granularity.coarse,
				dof_aperture: Meta.granularity.medium,
				dof_darken: Meta.granularity.medium,
				dof_gain: Meta.granularity.medium,
				dof_threshold: Meta.granularity.medium,
			})}
		</article>
	`)
})

