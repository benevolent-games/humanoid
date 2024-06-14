
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {LevelName, LevelImages} from "./levels.js"
import {onCarmackClick} from "../../../../../../../tools/zui.js"
import {QualitySelector} from "../../../../../../views/quality-selector/view.js"

export const GamePanel = hnexus.shadow_view(use => (o: {
		levelImages: LevelImages
		onClickStartGame: (level: LevelName) => void
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

	function startGame() {
		o.onClickStartGame(selectedLevel.value)
	}

	return html`
		<h2>select a level to play on</h2>

		<div class="levelselect" @change=${levelChange}>
			${Object.entries(o.levelImages).map(([level, img]) => html`
				<button
					class=based
					?data-selected=${isSelected(level)}
					${onCarmackClick(select(level))}>

					${img}

					<span class="levelname">${level}</span>

					${isSelected(level)
						? html`<span class=note>selected</span>`
						: null}
				</button>
			`)}
		</div>

		<div class=actionbar>
			${QualitySelector([])}
			<button
				class="play based fx"
				${onCarmackClick(startGame)}>
					start new game
			</button>
		</div>
	`
})

