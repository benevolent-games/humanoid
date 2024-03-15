
import {Id} from "@benev/toolbox/x/ecs6/core/types.js"
import {Component, Quat, Speeds as Speeds2, Vec2, Vec3} from "@benev/toolbox"

import {Ambulatory} from "./types.js"
import {Choreo} from "../../models/choreographer/types.js"
import { Attacking } from "../../models/attacking/types.js"

export class Debug extends Component<boolean> {}
export class Children extends Component<Id[]> {}

export class Scale extends Component<Vec3> {}
export class Position extends Component<Vec3> {}
export class Rotation extends Component<Quat> {}
export class Velocity extends Component<Vec3> {}
export class Gimbal extends Component<Vec2> {}
export class CoolGimbal extends Component<{
	records: Vec2[]
	gimbal: Vec2
}> {}
export class Orbit extends Component <null | Vec2> {}

export class PreviousPosition extends Component<Vec3> {}

// prop_ref
// child_prop_refs
// physics_rigid_ref

export class Density extends Component<number> {}
export class Mass extends Component<number> {}
export class DampingLinear extends Component<number> {}
export class DampingAngular extends Component<number> {}
export class Direction extends Component<Vec3> {}
export class Intensity extends Component<number> {}

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

export class Attack extends Component<{
	angle: number
	seconds: number
	phase: Attacking.Phase
}> {}

export class AttackWeights extends Component<{
	attacking: number
	notAttacking: number
	techniques: {
		a1: number
		a2: number
		a3: number
		a4: number
		a5: number
		a6: number
		a7: number
		a8: number
	}
}> {}

export class Force extends Component<Vec2> {}
export class AirborneTrajectory extends Component<Vec3> {}
export class Impetus extends Component<Vec3> {}
export class Jump extends Component<boolean> {}

export class Grounding extends Component<{
	grounded: boolean
	seconds: number
}> {}

export class Smoothing extends Component<number> {}
export class Choreography extends Component<Choreo> {}
export class Ambulation extends Component<Ambulatory & {
	smooth: {
		globalvel: Vec2
		normal: Vec2
		standing: number
		groundage: number
	}
}> {}

export class Perspective extends Component<"third_person" | "first_person"> {}

export class Speeds extends Component<Speeds2>{}
export class Stance extends Component<"stand" | "crouch"> {}
export class Sensitivity extends Component<{
	keys: number
	mouse: number
	stick: number
}> {}

export class Spectator extends Component<{}> {}
export class Humanoid extends Component<{}> {}

