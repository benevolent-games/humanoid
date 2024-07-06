
import {styles} from "./styles.js"
import {hnexus} from "../../../../nexus.js"
import {benevLinks} from "../../../../../../renderers/benev-links.js"

export const BPanel = hnexus.shadowView(use => () => {
	use.name("b-panel")
	use.styles(styles)
	return benevLinks()
})

