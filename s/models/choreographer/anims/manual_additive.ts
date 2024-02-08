
import {ManualAnim} from "./manual.js"
import {AnimationGroup} from "@babylonjs/core/Animations/animationGroup.js"

export class ManualAdditiveAnim extends ManualAnim {
	readonly referenceFrame: number

	constructor(group: AnimationGroup | undefined, referenceFrame: number) {
		super(group)

		this.referenceFrame = referenceFrame

		if (group) {
			this.group = AnimationGroup.MakeAnimationAdditive(group, {
				referenceFrame,
			})
		}
	}

	init() {
		this.weight = 0
		this.forceFrame(this.referenceFrame)
	}
}

