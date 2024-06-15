
import {html, nap} from "@benev/slate"

import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {LoadingScreen} from "./types.js"
import {assets} from "../../constants.js"
import {LoadingLevelView} from "./subviews/loading-level-view.js"

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
			${(() => {switch (loading.kind) {

				case "splash":
					return html`
						<div class=splash>
							<img src="${assets.benevLogo}" alt=""/>
						</div>
					`

				case "level":
					return LoadingLevelView([loading.level])

			}})()}
		</div>
	`
})

