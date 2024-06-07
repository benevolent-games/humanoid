
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {LevelName, LevelImages} from "./levels.js"
import {carmackify} from "../../../../../../../tools/zui.js"

export const GamePanel = hnexus.shadow_view(use => ({levelImages}: {
		levelImages: LevelImages
	}) => {

	use.name("game-panel")
	use.styles(styles)

	const selectedLevel = use.signal<LevelName>("village")

	function levelChange(event: InputEvent) {
		const target = event.target as HTMLInputElement
		selectedLevel.value = target.value as LevelName
	}

	function select(level: string) {
		return () => {
			selectedLevel.value = level as LevelName
		}
	}

	function isSelected(level: string) {
		return level === selectedLevel.value
	}

	return html`
		<div class="levelselect" @change=${levelChange}>
			${Object.entries(levelImages).map(([level, img]) => html`
				<button
					@mousedown=${carmackify(select(level))}
					@click=${select(level)}
					?data-selected=${isSelected(level)}>
					${img}
					<span class="levelname">${level}</span>
					${isSelected(level)
						? html`<span class=note>selected</span>`
						: null}
				</button>
			`)}
		</div>
	`
})

