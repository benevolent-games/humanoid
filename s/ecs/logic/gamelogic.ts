
import {system} from "../hub.js"
import {camera_rigging} from "./playable/camera_rigging.js"
import {choreography} from "./playable/choreography.js"
import { death } from "./playable/death.js"
import {humanoid} from "./playable/humanoid.js"
import {spectator} from "./playable/spectator.js"
import {ambulation} from "./pure/ambulation.js"
import {bot_ai} from "./pure/bot_ai.js"
import {combat} from "./pure/combat.js"
import {force} from "./pure/force.js"
import {freelook} from "./pure/freelook.js"
import {intentions} from "./pure/intentions.js"
import {melee_tracers} from "./pure/melee_tracers.js"
import {velocity} from "./pure/velocity.js"

export const gamelogic = system("root", [
	system("pure", [
		bot_ai,
		intentions,
		freelook,
		force,
		velocity,
		ambulation,
		combat,
	]),
	system("character", [
		spectator,
		humanoid,
		camera_rigging,
		choreography,
		melee_tracers,
		death,
	]),
])

