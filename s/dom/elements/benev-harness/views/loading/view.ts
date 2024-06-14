
import {css, html, nap} from "@benev/slate"

import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {LevelName} from "../main-menu/panels/game/levels.js"

export type LoadingSplash<W = any> = {
	kind: "splash"
	workload: Promise<W>
	onReady: (work: W) => void
	onDone: () => void
}

export type LoadingLevel<W = any> = {
	kind: "level"
	level: LevelName
	workload: Promise<W>
	onReady: (work: W) => void
	onDone: () => void
}

export type LoadingScreen<W = any> = LoadingSplash<W> | LoadingLevel<W>

export function loadingScreen<W>(loading: LoadingScreen<W>) {
	return loading
}

export const LoadingLevelView = hnexus.shadow_view(use => (level: LevelName) => {
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
			width: 100%;
			max-width: 50em;
		}
	`)

	const loaded = use.signal(false)
	const src = assets.levelpics[level].big

	function onload() {
		loaded.value = true
	}

	return html`
		<img src="${src}" alt="" @load=${onload} ?data-loaded=${loaded}/>
		<div class=info>
			<h1>${level}</h1>
			<p>Askrigg</p>
			<p>On the River Ure</p>
			<p>North Yorkshire under the Danelaw</p>
			<p>879 AD</p>
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
						<img class=splash src="${assets.benevLogo}" alt=""/>
					`

				case "level":
					return LoadingLevelView([loading.level])

			} })()}
		</div>
	`
})

