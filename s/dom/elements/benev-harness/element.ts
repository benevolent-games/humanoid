
import {html, nap} from "@benev/slate"
import {hnexus} from "./nexus.js"
import {styles} from "./styles.js"
import {LandingView} from "./views/landing/view.js"

export const BenevHarness = hnexus.shadow_component(use => {
	use.styles(styles)
	const mode = use.signal("landing")
	const splash = use.signal(false)

	async function switchModes(m: string) {
		splash.value = true
		await nap(600)
		mode.value = m
		await nap(0)
		splash.value = false
	}

	return html`
		<div class=splash ?data-active=${splash}>
			<img src="https://benevolent.games/assets/benevolent.svg" alt=""/>
		</div>
		${mode.value === "landing"
			? LandingView([{
				onClickPlay: () => switchModes("menu"),
			}])
			: html`
				<p>menu</p>
				<button @click="${() => switchModes("landing")}">back to landing</button>
			`}
	`
})

