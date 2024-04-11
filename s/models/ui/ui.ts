
import {Ecs} from "@benev/toolbox"
import {flatstate} from "@benev/slate"
import {Sensitivity} from "./types.js"
import {MeleeAction, MeleeAim} from "../../ecs/components/topics/warrior.js"

export class Ui {

	sensitivity: Sensitivity = flatstate({
		mouse: 360,
		keys: 180,
		stick: 180,
		touch: 1440,
	})

	debug = flatstate({
		meleeTracers: false,
	})

	reticle = flatstate({
		enabled: false,
		size: 1,
		opacity: 0.4,
		data: null as null | {
			meleeAim: null | Ecs.ComponentState<MeleeAim>
			meleeAction: null | Ecs.ComponentState<MeleeAction>
		}
	})
}

