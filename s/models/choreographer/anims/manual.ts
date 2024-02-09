
import {Anim} from "./anim.js"
import {scalar} from "@benev/toolbox"

export class ManualAnim extends Anim {

	forceFrame(frame: number) {
		this.group?.stop()
		this.group?.start(true, this.speedRatio, frame, frame)
	}

	// TODO prefer this over forceFrame??
	forceProgress(fraction: number) {
		const frame = scalar.lerp(
			fraction,
			this.group?.from ?? 0,
			this.group?.to ?? 100,
		)
		this.group?.stop()
		this.group?.start(true, this.speedRatio, frame, frame)
	}


	init() {
		this.weight = 0
		this.forceFrame(this.from)
	}
}

