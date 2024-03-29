
import {flatstate} from "@benev/slate"

export type Sensitivity = {

	/** arcseconds/count */
	mouse: number

	/** degrees/second */
	keys: number

	/** degrees/second */
	stick: number
}

export function makeSensitivity() {
	return flatstate({
		mouse: 360,
		keys: 180,
		stick: 180,
	})
}

