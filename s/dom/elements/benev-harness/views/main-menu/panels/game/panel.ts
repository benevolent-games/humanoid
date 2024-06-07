
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {carmackify} from "../../../../../../../tools/zui.js"

const levels = {
	village: "/assets/images/levelpics/village-03.small.webp",
	gym: "/assets/images/levelpics/gym-01.small.webp",
}

export const GamePanel = hnexus.shadow_view(use => () => {
	use.name("game-panel")
	use.styles(styles)

	const selectedLevel = use.signal<keyof typeof levels>("village")

	function levelChange(event: InputEvent) {
		const target = event.target as HTMLInputElement
		selectedLevel.value = target.value as keyof typeof levels
	}

	function select(level: string) {
		return () => {
			selectedLevel.value = level as keyof typeof levels
		}
	}

	function isSelected(level: string) {
		return level === selectedLevel.value
	}

	return html`
		<div class="levelselect" @change=${levelChange}>
			${Object.entries(levels).map(([level, pic]) => html`
				<button
					@mousedown=${carmackify(select(level))}
					@click=${select(level)}
					?data-selected=${isSelected(level)}>
					<img src="${pic}" alt=""/>
					<span class="levelname">${level}</span>
					${isSelected(level)
						? html`<span class=note>selected</span>`
						: null}
				</button>
			`)}
		</div>
	`
})

