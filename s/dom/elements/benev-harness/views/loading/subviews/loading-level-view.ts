
import {css, html} from "@benev/slate"
import {hnexus} from "../../../nexus.js"
import {assets} from "../../../constants.js"
import {Plan} from "../../../../../../models/planning/plan.js"
import {LoadingSpinner} from "../../../../../views/loading-spinner/view.js"

export const LoadingLevelView = hnexus.shadow_view(use => (level: Plan.Level) => {
	use.styles(css`
		:host {
			display: contents;
		}

		img.background {
			display: block;
			position: absolute;
			inset: 0;
			width: 100%;
			height: 100%;
			object-fit: cover;

			opacity: 0;
			transition: all var(--duration, 500ms) linear;
			&[data-loaded] { opacity: 1; }
		}

		.plate {
			position: absolute;
			z-index: 1;
			inset: 0;

			aspect-ratio: 16 / 9;
			height: 100%;
			max-width: 100%;
			margin: auto;

			> * {
				padding: 4%;
			}
		}

		h1.logo {
			display: block;
			position: absolute;
			top: 0;
			left: 0;
			width: 30%;

			> img {
				width: 100%;
				user-drag: none;
				-webkit-user-drag: none;
			}
		}

		.info {
			position: absolute;
			bottom: 0;
			left: 0;

			max-width: 50rem;

			font-size: 1.2em;
			font-family: Caudex, serif;
			color: white;
			text-shadow: .1em .2em .2em #0008;
		}

		.spinner {
			position: absolute;
			bottom: 0;
			right: 0;
			color: white;
			> slate-view {
				width: 4em;
				height: 4em;
			}
		}
	`)

	const loaded = use.signal(false)
	const src = level.images.big
	const {info} = level

	function onload() {
		loaded.value = true
	}

	return html`
		<img class=background src="${src}" alt="" @load=${onload} ?data-loaded=${loaded}/>
		<div class=plate>

			<h1 class=logo>
				<img src="${assets.heathenLogo}" alt="HEATHEN.gg"/>
			</h1>

			<div class=info>
				<h1>${info.label}</h1>
				${[
					info.context,
					info.location,
					info.date,
				].filter(x => !!x).map(x => html`<p>${x}</p>`)}
			</div>

			<div class=spinner>
				${LoadingSpinner([])}
			</div>

		</div>
	`
})

