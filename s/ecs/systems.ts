
import {system} from "./hub.js"

import {joints} from "./systems2/physics/joints.js"
import {statics} from "./systems2/physics/statics.js"
import {dynamics} from "./systems2/physics/dynamics.js"
import {fixtures} from "./systems2/physics/fixtures.js"
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
		fixtures,
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

