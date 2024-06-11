
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {onCarmackClick} from "../../../../../tools/zui.js"

export const LandingView = hnexus.shadow_view(use => (o: {
		onClickPlay: (event: MouseEvent) => void,
	}) => {

	use.name("landing")
	use.styles(styles)

	return html`
		<div class=bg style="--background-image: url('${assets.landingImage}');">
			<div class=plate>
				<h1>
					<img src="${assets.heathenLogo}" alt="HEATHEN.gg"/>
				</h1>

				<div class=buttonbar>
					<button
						class="play based gogo fx"
						${onCarmackClick(o.onClickPlay)}>
							play
					</button>
					<em>early access pre-alpha</em>
				</div>

				<section>
					<p>heathen is an incredible 3d multiplayer combat game about vikings that is kinda historically accurate.</p>
				</section>

				<footer>
					<p>by <a target="_blank" href="https://benevolent.games/">benevolent.games</a></p>
					<p>join our <a target="_blank" href="https://discord.gg/BnZx2utdev">discord</a></p>
				</footer>
			</div>
		</div>
	`
})

