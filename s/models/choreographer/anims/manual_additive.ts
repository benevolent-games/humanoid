
import {ManualAnim} from "./manual.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class ManualAdditiveAnim extends ManualAnim {
	readonly referenceFraction: number

	constructor(group: AnimationGroup | undefined, referenceFraction: number) {
		super(group)
		this.referenceFraction = referenceFraction

		if (group) this.group = AnimationGroup.MakeAnimationAdditive(
			group,
			{referenceFrame: this.calculateFrameFromFraction(referenceFraction)},
		)
	}

	init() {
		this.weight = 0
		this.forceProgress(this.referenceFraction)
	}
}

