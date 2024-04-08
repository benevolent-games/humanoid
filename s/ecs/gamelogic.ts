
import {system} from "./hub.js"
import {death} from "./logic/death.js"
import {camera_rigging} from "./logic/camera_rigging.js"
import {choreography} from "./logic/choreography.js"
import {humanoid} from "./logic/humanoid.js"
import {spectator} from "./logic/spectator.js"
import {ambulation} from "./logic/ambulation.js"
import {bot_ai} from "./logic/bot_ai.js"
import {combat} from "./logic/combat.js"
import {force} from "./logic/force.js"
import {freelook} from "./logic/freelook.js"
import {intentions} from "./logic/intentions.js"
import {melee_tracers} from "./logic/melee_tracers.js"
import {spawning} from "./logic/spawning.js"
import {velocity} from "./logic/velocity.js"
import {parenting} from "./logic/parenting.js"

export const gamelogic = system("root", () => [
	parenting,
	spawning,
	bot_ai,
	intentions,
	freelook,
	force,
	velocity,
	ambulation,
	combat,

	spectator,
	humanoid,
	camera_rigging,
	choreography,
	death,
])

export const logic_after_anims = system("after anims", () => [
	melee_tracers,
])

