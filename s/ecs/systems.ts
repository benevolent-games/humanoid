
import {system} from "./hub.js"

import {joints} from "./systems2/physics/joints.js"
import {statics} from "./systems2/physics/statics.js"
import {dynamics} from "./systems2/physics/dynamics.js"
import {choreography} from "./systems2/babylon/choreography.js"
import {environment} from "./systems2/babylon/environment.js"
import {parenting} from "./systems2/babylon/parenting.js"
import {humanoid} from "./systems2/babylon/humanoid.js"
import {lighting} from "./systems2/babylon/lighting.js"
import {spectator} from "./systems2/babylon/spectator.js"
import {force} from "./systems2/pure/force.js"
import {freelook} from "./systems2/pure/freelook.js"
import {intention} from "./systems2/pure/intention.js"
import {velocity} from "./systems2/pure/velocity.js"

export const systems = system("pipeline", () => [
	system("babylon", () => [
		environment,
		lighting,
		parenting,
		spectator,
		choreography,
		humanoid,
	]),
	system("physics", () => [
		dynamics,
		statics,
		joints,
	]),
	system("pure", () => [
		intention,
		freelook,
		force,
		velocity,
	]),
])

// import {hub, system} from "./hub.js"
// import {force_system} from "./systems/force.js"
// import {lighting_system} from "./systems/lighting.js"
// import {freelook_system} from "./systems/freelook.js"
// import {humanoid_system} from "./systems/humanoid.js"
// import {intention_system} from "./systems/intention.js"
// import {spectator_system} from "./systems/spectator.js"
// import {parenting_system} from "./systems/parenting.js"
// import {environment_system} from "./systems/environment.js"
// import {choreography_system} from "./systems/choreography.js"
// import {velocity_calculator_system} from "./systems/velocity_calculator.js"
// import {physics_dynamics_system, physics_fixed_system, physics_fixture, physics_joints_system} from "./systems/physics.js"

// export const mainpipe = hub.pipeline(
// 	intention_system,
// 	force_system,
// 	freelook_system,
// 	environment_system,
// 	parenting_system,
// 	lighting_system,
// 	physics_fixed_system,
// 	physics_fixture,
// 	physics_joints_system,
// 	physics_dynamics_system,
// 	spectator_system,
// 	humanoid_system,
// 	velocity_calculator_system,
// 	choreography_system,
// )

