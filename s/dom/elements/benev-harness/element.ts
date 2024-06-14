
import {RenderResult, html, nap} from "@benev/slate"

import {hnexus} from "./nexus.js"
import {styles} from "./styles.js"
import {assets} from "./constants.js"
import {loadVideo} from "./utils/load-video.js"
import {loadAudio} from "./utils/load-audio.js"
import {loadImage} from "./utils/load-image.js"
import {LandingView} from "./views/landing/view.js"
import {MainMenuView} from "./views/main-menu/view.js"
import {loadLevelThumbnails} from "./views/main-menu/panels/game/levels.js"
import {LoadingScreen, LoadingView, loadingScreen} from "./views/loading/view.js"

/**
 * coordinate the app state at the highest level.
 *  - orchestrate loading screens between major modes.
 */
export const BenevHarness = hnexus.shadow_component(use => {
	use.styles(styles)

	const loading = use.signal<LoadingScreen | null>(null)
	const exhibit = use.signal<RenderResult>(
		LandingView([{onClickPlay: launchMenu}])
	)

	// preload logo image for splash screen
	use.once(() => loadImage(assets.benevLogo))

	async function launchLanding() {
		if (loading.value)
			return
		loading.value = loadingScreen({
			kind: "splash",
			workload: Promise.resolve(),
			onReady: () => {
				exhibit.value = LandingView([{
					onClickPlay: launchMenu,
				}])
			},
			onDone: () => {
				loading.value = null
			}
		})
	}

	async function launchMenu() {
		if (loading.value)
			return
		loading.value = loadingScreen({
			kind: "splash",
			workload: Promise.all([
				loadVideo(assets.menuVideo),
				loadAudio(assets.menuMusic),
				loadLevelThumbnails(),
			]),
			onReady: ([video, audio, levelImages]) => {
				exhibit.value = MainMenuView([{
					video,
					audio,
					levelImages,
					onClickExit: launchLanding,
				}])
			},
			onDone: () => {
				loading.value = null
			},
		})
	}

	return html`
		${loading.value
			? LoadingView([loading.value])
			: null}
		${exhibit}
	`
})

