
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {QualitySelector} from "../../../../../../views/quality-selector/view.js"

export const SettingsPanel = hnexus.shadowView(use => () => {
	use.name("settings-panel")
	use.styles(styles)
	return QualitySelector([])
})

