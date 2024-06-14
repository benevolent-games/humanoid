
import {html, nap} from "@benev/slate"

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
			nap(501),
		])

		// deactivate blanket
		active.value = false

		// call onReady with completed workload
		loading.onReady(work)

		// wait for blanket anim to finish
		await nap(501)

		// tell our parent that we're all done
		loading.onDone()
	})

	function animend() {
		console.log("animend")
	}

	return html`
		<div class=blanket ?data-active=${active} @transitionend=${animend}>
			${(() => { switch (loading.kind) {

				case "splash": return html`
					<img class=splash src="${assets.benevLogo}" alt=""/>
				`

				case "level": return html`
					<div class=level>
						level
					</div>
				`
			} })()}
		</div>
	`
})

