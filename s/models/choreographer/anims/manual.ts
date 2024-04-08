
import {Anim} from "./anim.js"
import {scalar} from "@benev/toolbox"

export class ManualAnim extends Anim {

	calculateFrameFromFraction(fraction: number) {
		return scalar.lerp(
			fraction,
			this.group?.from ?? 0,
			this.group?.to ?? 100,
		)
	}

	setProgress(fraction: number) {
		const frame = this.calculateFrameFromFraction(fraction)
		this.group?.stop()
		this.group?.start(true, this.speedRatio, frame, frame)
	}

	init() {
		this.weight = 0
		this.setProgress(0)
	}
}

