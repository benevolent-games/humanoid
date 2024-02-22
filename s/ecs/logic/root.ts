
import {system} from "../hub.js"
import {humanoid} from "./playable/humanoid.js"
import {spectator} from "./playable/spectator.js"
import {ambulation} from "./pure/ambulation.js"
import {force} from "./pure/force.js"
import {freelook} from "./pure/freelook.js"
import {intentions} from "./pure/intentions.js"
import {velocity} from "./pure/velocity.js"

export const root = system("root", [
	system("pure", [
		intentions,
		freelook,
		force,
		velocity,
		ambulation,
	]),
	system("character", [
		spectator,
		humanoid,
	])
])

