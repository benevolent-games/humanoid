
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"

export const LandingView = hnexus.shadow_view(use => (o: {
		onClickPlay: (event: MouseEvent) => void,
	}) => {

	use.styles(styles)

	return html`
		<h1 class=header style="background-image: url('/assets/graphics/heathen-logo/banner.webp');">
			<div class="logobox slice">
				<img class="logo" src="/assets/graphics/heathen-logo/heathen-gg.small.webp" alt="HEATHEN.GG"/>
			</div>
		</h1>

		<section class="plate slice">
			<header class=buttons>
				<button class=play @click="${o.onClickPlay}">play</button>
				<button class=quality>mid quality</button>
			</header>

			<div class="content text">
				<p>heathen is an incredible 3d multiplayer combat game about vikings that is kinda historically accurate.</p>
			</div>

			<footer class="text">
				<p>by <a href="https://benevolent.games/">benevolent.games</a></p>
				<p>join our <a href="https://discord.gg/BnZx2utdev">discord</a></p>
			</footer>
		</section>
	`
})

