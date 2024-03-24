
import {flatstate} from "@benev/slate"

export type ReticuleData = ReturnType<typeof makeReticuleData>

export function makeReticuleData() {
	return flatstate({
		enabled: true,
		size: 1,
		opacity: 0.5,
		aim_angle: 0,
	})
}

