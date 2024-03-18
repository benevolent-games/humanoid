
import {system} from "../hub.js"
import {attacking} from "./playable/attacking.js"
import {camera_rigging} from "./playable/camera_rigging.js"
import {choreography} from "./playable/choreography.js"
import {humanoid} from "./playable/humanoid.js"
import {spectator} from "./playable/spectator.js"
import {ambulation} from "./pure/ambulation.js"
import {combat} from "./pure/combat.js"
import {force} from "./pure/force.js"
import {freelook} from "./pure/freelook.js"
import {intentions} from "./pure/intentions.js"
import {velocity} from "./pure/velocity.js"

export const gamelogic = system("root", [
	system("pure", [
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
		attacking,
	]),
])

