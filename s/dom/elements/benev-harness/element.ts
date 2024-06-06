
import {html, nap} from "@benev/slate"

import {hnexus} from "./nexus.js"
import {styles} from "./styles.js"
import {assets} from "./constants.js"
import {loadVideo} from "./utils/load-video.js"
import {loadAudio} from "./utils/load-audio.js"
import {LandingView} from "./views/landing/view.js"
import {MainMenuView} from "./views/main-menu/view.js"

export const BenevHarness = hnexus.shadow_component(use => {
	use.styles(styles)

	const mode = use.signal<"landing" | "menu">("landing")
	const splash = use.signal(false)
	const video = use.signal<HTMLVideoElement | null>(null)
	const audio = use.signal<HTMLAudioElement | null>(null)

	async function showSplash() {
		splash.value = true
		await nap(600)
	}

	async function hideSplash() {
		await nap(0)
		splash.value = false
	}

	async function onClickPlay() {
		await Promise.all([
			showSplash(),
			loadVideo(assets.menuVideo).then(v => { video.value = v }),
			loadAudio(assets.menuMusic).then(a => { audio.value = a }),
		])
		mode.value = "menu"
		await hideSplash()
	}

	// ///////// HACK auto-play
	// const started = use.signal(false)
	// use.defer(() => {
	// 	if (started.value)
	// 		return
	// 	onClickPlay()
	// 	started.value = true
	// })
	// ///////// HACK auto-play

	return html`
		<div class=splash ?data-active=${splash}>
			<img src="${assets.benevLogo}" alt=""/>
		</div>

		${mode.value === "landing"

			? LandingView([{onClickPlay}])

			: MainMenuView([{
				video,
				audio,
				onClickExit: async() => {
					await showSplash()
					mode.value = "landing"
					await hideSplash()
				},
			}])}
	`
})

