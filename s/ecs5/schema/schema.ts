
import {Component, Id} from "@benev/toolbox/x/ecs/ecs5.js"
import {Quat, Speeds as Speeds2, Vec2, Vec3} from "@benev/toolbox"
import {Ambulatory as Ambulatory2} from "../../ecs/systems/pure/ambulation.js"
import {Choreography as Choreography2} from "../../models/choreographer/types.js"

export class Debug extends Component<boolean> {}
export class Children extends Component<Id[]> {}

export class Scale extends Component<Vec3> {}
export class Position extends Component<Vec3> {}
export class Rotation extends Component<Quat> {}
export class Velocity extends Component<Vec3> {}

export class PreviousPosition extends Component<Vec3> {}

// prop_ref
// child_prop_refs
// physics_rigid_ref

export class Density extends Component<number> {}
export class Mass extends Component<number> {}
export class DampingLinear extends Component<number> {}
export class DampingAngular extends Component<number> {}
export class Height extends Component<number> {}
export class Radius extends Component<number> {}
export class Direction extends Component<Vec3> {}
export class Intensity extends Component<number> {}
export class ThirdPersonCam extends Component<{distance: number}> {}

// physical_dynamic
// physical_fixture
// joint
//   parts
//   anchors

export class Shape extends Component<"box"> {}

export class Ai extends Component<{}> {}
export class Seed extends Component<number> {}
export class DesiredDirection extends Component<Vec2> {}

export class Controllable extends Component<{}> {}
export class Intent extends Component<{
	amble: Vec2
	glance: Vec2
	fast: boolean
	slow: boolean
	jump: boolean
	attack: boolean
}> {}

export class Attackage extends Component<{
	attack: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
	seconds: number
}> {}

export class Force extends Component<Vec2> {}
export class AirborneTrajectory extends Component<Vec3> {}
export class Impetus extends Component<Vec3> {}
export class Gimbal extends Component<Vec2> {}
export class Jump extends Component<boolean> {}

export class Grounding extends Component<{
	grounded: boolean
	seconds: number
}> {}

export class Smoothing extends Component<number> {}
export class Choreography extends Component<Choreography2> {}
export class Ambulatory extends Component<Ambulatory2 & {
	smooth: {
		globalvel: Vec2
		normal: Vec2
		standing: number
		groundage: number
	}
}> {}

export class Speeds extends Component<Speeds2>{}
export class Stance extends Component<"stand" | "crouch"> {}
export class Sensitivity extends Component<{
	keys: number
	mouse: number
	stick: number
}> {}

export class Humanoid extends Component<{}> {}

