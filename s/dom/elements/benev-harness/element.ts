
import {html, nap} from "@benev/slate"

import {hnexus} from "./nexus.js"
import {styles} from "./styles.js"
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

	const logoSrc = "/assets/graphics/benevolent.svg"
	const videoSrc = "/assets/graphics/menu.webm"
	const audioSrc = "/assets/audio/music/group-1/anticipate.mid.m4a"

	async function showSplash() {
		splash.value = true
		await nap(600)
	}

	async function hideSplash() {
		await nap(0)
		splash.value = false
	}

	return html`
		<div class=splash ?data-active=${splash}>
			<img src="${logoSrc}" alt=""/>
		</div>

		${mode.value === "landing"

			? LandingView([{
				onClickPlay: async() => {
					await Promise.all([
						showSplash(),
						loadVideo(videoSrc).then(v => { video.value = v }),
						loadAudio(audioSrc).then(a => { audio.value = a }),
					])
					mode.value = "menu"
					await hideSplash()
				},
			}])

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

