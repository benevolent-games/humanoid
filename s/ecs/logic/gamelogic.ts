
import {system} from "../hub.js"
import {camera_rigging} from "./playable/camera_rigging.js"
import {choreography} from "./playable/choreography.js"
import {humanoid} from "./playable/humanoid.js"
import {spectator} from "./playable/spectator.js"
import {ambulation} from "./pure/ambulation.js"
import {force} from "./pure/force.js"
import {freelook} from "./pure/freelook.js"
import {gimballing} from "./pure/gimballing.js"
import {intentions} from "./pure/intentions.js"
import {velocity} from "./pure/velocity.js"

export const gamelogic = system("root", [
	system("pure", [
		gimballing,
		intentions,
		freelook,
		force,
		velocity,
		ambulation,
	]),
	system("character", [
		spectator,
		humanoid,
		camera_rigging,
		choreography,
	])
])

