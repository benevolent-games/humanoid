
import {Id, Quat, Speeds as Speeds2, Vec2, Vec3} from "@benev/toolbox"

import {Component} from "../hub.js"
import {Ambulatory} from "./types.js"
import {Choreo} from "../../models/choreographer/types.js"

export class Parent extends Component<Id> {}
export class Children extends Component<Id[]> {}

export class Spawner extends Component<{
	bots: Id[]
	starting_at: {
		position: Vec3
		gimbal: Vec2
	}
	inputs: {
		respawn: boolean
		bot_spawn: boolean
		bot_delete: boolean
		switch_to_player: boolean
		switch_to_spectator: boolean
	}
}> {}

export class SpawnTracker extends Component<{}> {}

export class Debug extends Component<boolean> {}

export class Scale extends Component<Vec3> {}
export class Position extends Component<Vec3> {}
export class Rotation extends Component<Quat> {}
export class Velocity extends Component<Vec3> {}

/** rotations in radians, x-axis is 360 degrees, y-axis is 180 degrees from -90 to 90. */
export class Gimbal extends Component<Vec2> {}

export class GimbalSway extends Component<{
	records: Vec2[]
	gimbal: Vec2
}> {}
export class Orbit extends Component <null | Vec2> {}

export class PreviousPosition extends Component<Vec3> {}

export class Density extends Component<number> {}
export class Mass extends Component<number> {}
export class DampingLinear extends Component<number> {}
export class DampingAngular extends Component<number> {}
export class Direction extends Component<Vec3> {}
export class Intensity extends Component<number> {}

export class Shape extends Component<"box"> {}

export class Ai extends Component<{}> {}
export class Seed extends Component<number> {}

export class Controllable extends Component<{}> {}
export class Intent extends Component<{
	amble: Vec2
	glance: Vec2
	fast: boolean
	slow: boolean
	jump: boolean
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

export class Spectator extends Component<{}> {}
export class Humanoid extends Component<{}> {}
export class Bot extends Component<{}> {}

