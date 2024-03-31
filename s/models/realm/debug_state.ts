

import {flatstate} from "@benev/slate"

export type DebugState = ReturnType<typeof makeDebugState>

export function makeDebugState() {
	return flatstate({
		meleeTracers: false,
	})
}

