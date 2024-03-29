
import {flatstate} from "@benev/slate"

export type ReticuleState = ReturnType<typeof makeReticuleState>

export type Aiming = {
	busy: boolean
	angle: null | number
}

export function makeReticuleState() {
	return flatstate({
		enabled: false,
		size: 1,
		opacity: 0.4,
		aim: flatstate({
			busy: false,
			angle: null,
		}) as Aiming,
	})
}

