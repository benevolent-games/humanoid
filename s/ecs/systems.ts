
import {system} from "./hub.js"

import {joints} from "./systems/physics/joints.js"
import {statics} from "./systems/physics/statics.js"
import {dynamics} from "./systems/physics/dynamics.js"
import {fixtures} from "./systems/physics/fixtures.js"
import {choreography} from "./systems/babylon/choreography.js"
import {environment} from "./systems/babylon/environment.js"
import {parenting} from "./systems/babylon/parenting.js"
import {humanoid} from "./systems/babylon/humanoid.js"
import {lighting} from "./systems/babylon/lighting.js"
import {spectator} from "./systems/babylon/spectator.js"
import {force} from "./systems/pure/force.js"
import {freelook} from "./systems/pure/freelook.js"
import {intentions} from "./systems/pure/intentions.js"
import {velocity} from "./systems/pure/velocity.js"

export const systems = system("pipeline", () => [
	system("pure", () => [
		intentions,
		freelook,
		force,
		velocity,
	]),

	system("babylon", () => [
		environment,
		lighting,
		parenting,
		humanoid,
		spectator,
		choreography,
	]),

	system("physics", () => [
		dynamics,
		fixtures,
		statics,
		joints,
	]),
])

