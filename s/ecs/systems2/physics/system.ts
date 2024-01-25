
import {system} from "../../hub.js"
import {joints} from "./subsystems/joints.js"
import {statics} from "./subsystems/statics.js"
import {dynamics} from "./subsystems/dynamics.js"

export const physics_system = system("physics", () => [
	dynamics,
	statics,
	joints,
])

