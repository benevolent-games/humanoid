
import {html, nap} from "@benev/slate"

import {hnexus} from "./nexus.js"
import {styles} from "./styles.js"
import {LandingView} from "./views/landing/view.js"
import {MainMenuView} from "./views/main-menu/view.js"

async function loadMenuVideo() {
	return await new Promise<HTMLVideoElement>((resolve, reject) => {
		const video = document.createElement("video")
		video.preload = "auto"
		video.src = "/assets/graphics/menu.webm"
		video.autoplay = true
		video.loop = true
		video.oncanplaythrough = () => resolve(video)
		video.onerror = reject
		video.load()
	})
}

async function loadMenuAudio() {
	return await new Promise<HTMLAudioElement>((resolve, reject) => {
		const audio = document.createElement("audio")
		audio.preload = "auto"
		audio.src = "/assets/audio/music/group-1/anticipate.mid.m4a"
		audio.autoplay = true
		audio.loop = true
		audio.oncanplaythrough = () => resolve(audio)
		audio.onerror = reject
		audio.load()
	})
}

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

	return html`
		<div class=splash ?data-active=${splash}>
			<img src="https://benevolent.games/assets/benevolent.svg" alt=""/>
		</div>

		${mode.value === "landing"

			? LandingView([{
				onClickPlay: async() => {
					await Promise.all([
						showSplash(),
						loadMenuVideo().then(v => { video.value = v }),
						loadMenuAudio().then(a => { audio.value = a }),
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

