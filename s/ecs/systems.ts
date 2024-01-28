
import {system} from "./hub.js"

import {joints} from "./systems/physics/joints.js"
import {statics} from "./systems/physics/statics.js"
import {dynamics} from "./systems/physics/dynamics.js"
import {fixtures} from "./systems/physics/fixtures.js"
import {environment} from "./systems/babylon/environment.js"
import {parenting} from "./systems/babylon/parenting.js"
import {lighting} from "./systems/babylon/lighting.js"
import {force} from "./systems/pure/force.js"
import {freelook} from "./systems/pure/freelook.js"
import {intentions} from "./systems/pure/intentions.js"
import {velocity} from "./systems/pure/velocity.js"
import {humanoid} from "./systems/characters/humanoid.js"
import {spectator} from "./systems/characters/spectator.js"
import {choreography} from "./systems/characters/choreography.js"

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
	]),

	system("characters", () => [
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

