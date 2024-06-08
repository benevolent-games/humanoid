
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../nexus.js"
import {assets} from "../../constants.js"
import {carmackify} from "../../../../../tools/zui.js"
import {QualitySelector} from "../../../../views/quality-selector/view.js"

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

				<div class="buttonbar">
					<button
						class="play"
						@mousedown=${carmackify(o.onClickPlay)}
						@click=${o.onClickPlay}>
							▶ play
					</button>
					${QualitySelector([])}
				</div>

				<section>
					<p>heathen is an incredible 3d multiplayer combat game about vikings that is kinda historically accurate.</p>
				</section>

				<footer>
					<p>by <a href="https://benevolent.games/">benevolent.games</a></p>
					<p>join our <a href="https://discord.gg/BnZx2utdev">discord</a></p>
				</footer>
			</div>
		</div>
	`
})

