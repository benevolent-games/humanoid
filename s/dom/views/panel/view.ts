
import {TemplateResult, clone, debounce, html, reactor} from "@benev/slate"

import {styles} from "./styles.js"
import {nexus} from "../../../nexus.js"
import {Toggler} from "./parts/toggler.js"
import {HumanoidRealm} from "../../../models/realm/realm.js"
import {Effects, NuiCheckbox, NuiRange, Stage} from "@benev/toolbox"

export const Panel = nexus.shadow_view(use => (realm: HumanoidRealm) => {
	use.name("panel")
	use.styles(styles)

	const resolution = use.signal(realm.porthole.resolution * 100)
	const std = use.once(() => Stage.effects.everything())

	const ssao = use.flatstate(std.ssao)
	const ssr = use.flatstate(std.ssr)

	const antialiasing = use.flatstate(std.default.antialiasing)
	const imageProcessing = use.flatstate(std.default.imageProcessing)
	const bloom = use.flatstate(std.default.bloom)
	const grain = use.flatstate(std.default.grain)
	const sharpen = use.flatstate(std.default.sharpen)
	const chromaticAberration = use.flatstate(std.default.chromaticAberration)
	const glow = use.flatstate(std.default.glow)
	const depthOfField = use.flatstate(std.default.depthOfField)

	const active = use.flatstate({
		ssao: false,
		ssr: false,

		default: false,
		antialiasing: false,
		imageProcessing: false,
		bloom: false,
		grain: false,
		sharpen: false,
		chromaticAberration: false,
		glow: false,
		depthOfField: false,
	})

	const apply_effects = use.once(() => debounce(500, (effects: Effects) => {
		if (!active.ssao)
			effects.ssao = null

		if (!active.ssr)
			effects.ssr = null

		if (!active.antialiasing)
			effects.default!.antialiasing = null

		if (!active.imageProcessing)
			effects.default!.imageProcessing = null

		if (!active.bloom)
			effects.default!.bloom = null

		if (!active.grain)
			effects.default!.grain = null

		if (!active.sharpen)
			effects.default!.sharpen = null

		if (!active.chromaticAberration)
			effects.default!.chromaticAberration = null

		if (!active.glow)
			effects.default!.glow = null

		if (!active.depthOfField)
			effects.default!.depthOfField = null

		if (!active.default)
			effects.default = null

		realm.stage.rendering.setEffects(effects)
	}))

	use.mount(() => reactor.reaction(
		() => clone({active, effects: {ssao, ssr, default: {antialiasing, imageProcessing, bloom, grain, sharpen, chromaticAberration, glow, depthOfField}}}),
		({effects}) => apply_effects(effects)),
	)

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
	type Group = {[key: string]: number | boolean}
	type NumSpec<G extends Group> = {
		[K in keyof G as G[K] extends number ? K : never]: Granularity
	}

	const granularity = {
		alphaMode: {min: 0, max: 5, step: 1},
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
				else throw new Error(`invalid setting "${key}"`)
			})
		}
	}

	function render_section<G extends Group>(
			activeKey: keyof typeof active,
			group: G,
		) {
		return (spec: NumSpec<G>) => html`
			<header ?data-active="${active[activeKey]}">
				${NuiCheckbox([{
					label: activeKey,
					checked: active[activeKey],
					set: x => active[activeKey] = x,
				}])}
			</header>
			<section class=group ?data-hidden="${!active[activeKey]}">
				${settings(group)(spec)}
			</section>
		`
	}

	return wrap(html`
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
			<header ?data-active="${active.default}">
				${NuiCheckbox([{
					label: "core",
					checked: active.default,
					set: x => active.default = x,
				}])}
			</header>
			<article ?data-hidden="${!active.default}">
				${render_section("antialiasing", antialiasing)({
					samples: granularity.samples,
				})}

				${render_section("imageProcessing", imageProcessing)({
					contrast: granularity.medium,
					exposure: granularity.medium,
				})}

				${render_section("bloom", bloom)({
					weight: granularity.medium,
					threshold: granularity.fine,
					scale: granularity.medium,
					kernel: granularity.bigSamples,
				})}

				${render_section("chromaticAberration", chromaticAberration)({
					aberrationAmount: granularity.coarse,
					radialIntensity: granularity.medium,
					alphaMode: granularity.alphaMode,
				})}

				${render_section("glow", glow)({
					intensity: granularity.medium,
					blurKernelSize: granularity.samples,
				})}

				${render_section("grain", grain)({
					intensity: granularity.coarse,
				})}

				${render_section("sharpen", sharpen)({
					colorAmount: granularity.medium,
					edgeAmount: granularity.medium,
				})}

				${render_section("depthOfField", depthOfField)({
					blurLevel: granularity.medium,
					fStop: granularity.medium,
					focalLength: granularity.coarse,
					focusDistance: granularity.giant,
					lensSize: granularity.coarser,
				})}
			</article>
		</article>

		<article>
			${render_section("ssao", ssao)({
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
		</article>

		<article>
			${render_section("ssr", ssr)({
				maxDistance: granularity.giant,
				maxSteps: granularity.coarser,
				reflectionSpecularFalloffExponent: granularity.medium,
				roughnessFactor: granularity.fine,
				strength: granularity.medium,
				blurDispersionStrength: granularity.medium,
				reflectivityThreshold: granularity.superfine,
				blurDownsample: granularity.medium,
				ssrDownsample: granularity.medium,
				samples: granularity.coarse,
				step: granularity.medium,
				thickness: granularity.medium,
				selfCollisionNumSkip: granularity.medium,
				backfaceDepthTextureDownsample: granularity.medium,
			})}
		</article>
	`)
})

