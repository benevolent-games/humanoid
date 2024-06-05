
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

export const BenevHarness = hnexus.shadow_component(use => {
	use.styles(styles)
	const mode = use.signal<"landing" | "menu">("landing")
	const splash = use.signal(false)
	const video = use.signal<HTMLVideoElement | null>(null)

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
						loadMenuVideo().then(v => {
							video.value = v
						})
					])
					mode.value = "menu"
					await hideSplash()
				},
			}])
			: MainMenuView([{
				video,
				onClickExit: async() => {
					await showSplash()
					mode.value = "landing"
					await hideSplash()
				},
			}])}
	`
})

