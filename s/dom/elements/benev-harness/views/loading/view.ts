
import {css, html, nap} from "@benev/slate"

import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {Plan} from "../../../../../models/planning/plan.js"

export type LoadingSplash<W = any> = {
	kind: "splash"
	workload: Promise<W>
	onReady: (work: W) => void
	onDone: () => void
}

export type LoadingLevel<W = any> = {
	kind: "level"
	level: Plan.Level
	workload: Promise<W>
	onReady: (work: W) => void
	onDone: () => void
}

export type LoadingScreen<W = any> = LoadingSplash<W> | LoadingLevel<W>

export function asLoadingScreen<W>(loading: LoadingScreen<W>) {
	return loading
}

export const LoadingLevelView = hnexus.shadow_view(use => (level: Plan.Level) => {
	use.styles(css`
		:host {
			display: contents;
		}
		img {
			display: block;
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;

			opacity: 0;
			transition: all var(--duration, 500ms) linear;

			&[data-loaded] {
				opacity: 1;
			}
		}
		.info {
			position: relative;
			z-index: 1;
			height: 100%;
			max-width: 100%;
			aspect-ratio: 16 / 9;

			font-size: 1.2em;
			font-family: Caudex, serif;
			color: white;
			text-shadow: .1em .2em .2em #0008;

			display: flex;
			flex-direction: column;
			justify-content: end;
			align-items: start;
			padding: 4%;

			> * {
				max-width: 50rem;
			}
		}
	`)

	const loaded = use.signal(false)
	const src = level.images.big
	const {info} = level

	function onload() {
		loaded.value = true
	}

	return html`
		<img src="${src}" alt="" @load=${onload} ?data-loaded=${loaded}/>
		<div class=info>
			<h1>
				<span>${info.label.english}</span>
			</h1>
			${[
				info.context,
				info.location,
				info.date,
			].filter(x => !!x).map(x => html`<p>${x}</p>`)}
		</div>
	`
})

export const LoadingView = hnexus.shadow_view(use => (loading: LoadingScreen) => {
	use.styles(styles)
	const active = use.signal(false)

	// activate the blanket
	use.once(async() => {
		await nap()
		active.value = true
	})

	// loading lifecycle
	use.once(async() => {

		// wait for blanket anim and loading to finish
		const [work] = await Promise.all([
			loading.workload,
			nap(600),
		])

		// deactivate blanket
		active.value = false

		// call onReady with completed workload
		loading.onReady(work)

		// wait for blanket anim to finish
		await nap(600)

		// tell our parent that we're all done
		loading.onDone()
	})

	return html`
		<div class=blanket ?data-active=${active}>
			${(() => { switch (loading.kind) {

				case "splash":
					return html`
						<div class=splash>
							<img src="${assets.benevLogo}" alt=""/>
						</div>
					`

				case "level":
					return LoadingLevelView([loading.level])

			} })()}
		</div>
	`
})

