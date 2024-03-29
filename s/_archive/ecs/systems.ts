
import {system} from "./hub.js"

import {joints} from "./systems/physics/joints.js"
import {statics} from "./systems/physics/statics.js"
import {dynamics} from "./systems/physics/dynamics.js"
import {fixtures} from "./systems/physics/fixtures.js"
import {environment} from "./systems/babylon/environment.js"
import {sky} from "./systems/babylon/sky.js"
import {parenting} from "./systems/babylon/parenting.js"
import {lighting} from "./systems/babylon/lighting.js"
import {force} from "./systems/pure/force.js"
import {freelook} from "./systems/pure/freelook.js"
import {intentions} from "./systems/pure/intentions.js"
import {velocity} from "./systems/pure/velocity.js"
import {humanoid} from "./systems/characters/humanoid.js"
import {spectator} from "./systems/characters/spectator.js"
import {choreography} from "./systems/characters/choreography.js"
import {ambulation} from "./systems/pure/ambulation.js"
import {attacking} from "./systems/characters/attacking.js"
import {ai} from "./systems/ai/ai.js"

export const systems = system("pipeline", () => [

	system("pure", () => [
		intentions,
		freelook,
		force,
		velocity,
		ambulation,
	]),

	system("babylon", () => [
		environment,
		sky,
		lighting,
		parenting,
	]),

	system("characters", () => [
		humanoid,
		spectator,
		choreography,
		attacking,
		ai,
	]),

	system("physics", () => [
		dynamics,
		fixtures,
		statics,
		joints,
	]),

])

