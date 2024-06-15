
import {RenderResult, html, nap} from "@benev/slate"

import {hnexus} from "./nexus.js"
import {styles} from "./styles.js"
import {assets} from "./constants.js"
import {HuLevel} from "../../../gameplan.js"
import {loadVideo} from "./utils/load-video.js"
import {loadAudio} from "./utils/load-audio.js"
import {loadImage} from "./utils/load-image.js"
import {LandingView} from "./views/landing/view.js"
import {GameplayView} from "./views/gameplay/view.js"
import {MainMenuView} from "./views/main-menu/view.js"
import {loadLevelThumbnails} from "./views/main-menu/panels/game/levels.js"
import {LoadingScreen, LoadingView, asLoadingScreen} from "./views/loading/view.js"

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

	function onDone() {
		loading.value = null
	}

	async function launchLanding() {
		if (loading.value)
			return
		loading.value = asLoadingScreen({
			kind: "splash",
			onDone,
			workload: Promise.resolve(),
			onReady: () => {
				exhibit.value = LandingView([{
					onClickPlay: launchMenu,
				}])
			},
		})
	}

	async function launchMenu() {
		if (loading.value)
			return
		loading.value = asLoadingScreen({
			kind: "splash",
			onDone,
			workload: Promise.all([
				loadVideo(assets.menuVideo),
				loadAudio(assets.menuMusic),
				loadLevelThumbnails(use.context.gameplan.value.levels),
			]),
			onReady: ([video, audio, levelImages]) => {
				exhibit.value = MainMenuView([{
					video,
					audio,
					levelImages,
					onClickExit: launchLanding,
					onClickStartGame: launchGameplay,
				}])
			},
		})
	}

	async function launchGameplay(level: HuLevel) {
		if (loading.value)
			return
		loading.value = asLoadingScreen({
			kind: "level",
			level: use.context.gameplan.value.levels[level],
			onDone,
			workload: nap(5000),
			onReady: () => {
				exhibit.value = GameplayView([{
					onClickBackToMenu: launchMenu,
				}])
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

