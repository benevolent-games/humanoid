
import {html} from "@benev/slate"
import {styles} from "./styles.js"
import {LevelImages} from "./levels.js"
import {hnexus} from "../../../../nexus.js"
import {HuLevel} from "../../../../../../../gameplan.js"
import {onCarmackClick} from "../../../../../../../tools/zui.js"
import {QualitySelector} from "../../../../../../views/quality-selector/view.js"

export const GamePanel = hnexus.shadow_view(use => (o: {
		levelImages: LevelImages
		onClickStartGame: (level: HuLevel) => void
	}) => {

	use.name("game-panel")
	use.styles(styles)

	const selectedLevel = use.signal<HuLevel>("viking_village")

	function levelChange(event: InputEvent) {
		const target = event.target as HTMLInputElement
		selectedLevel.value = target.value as HuLevel
	}

	function select(level: string) {
		return () => {
			selectedLevel.value = level as HuLevel
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

		<div class=levelselect @change=${levelChange}>
			${Object.entries(o.levelImages).map(([levelName, img]) => {
				const {info} = use.context.gameplan.value.levels[levelName as HuLevel]
				return html`
					<button
						class=based
						?data-selected=${isSelected(levelName)}
						${onCarmackClick(select(levelName))}>

						${img}

						<span class=label>${info.label.norse ?? info.label.english}</span>

						${isSelected(levelName)
							? html`<span class=note>selected</span>`
							: null}
					</button>
				`
			})}
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

