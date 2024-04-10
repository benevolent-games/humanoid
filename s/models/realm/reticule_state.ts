
import {Ecs} from "@benev/toolbox"
import {flatstate} from "@benev/slate"
import {MeleeAction, MeleeAim} from "../../ecs/components/topics/warrior.js"

export type ReticuleState = ReturnType<typeof makeReticuleState>

export function makeReticuleState() {
	return flatstate({
		enabled: false,
		size: 1,
		opacity: 0.4,
		data: null as null | {
			meleeAim: null | Ecs.ComponentState<MeleeAim>
			meleeAction: null | Ecs.ComponentState<MeleeAction>
		}
	})
}

