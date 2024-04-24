
import {LevelScript} from "./types.js"
import {HuLevel} from "../../gameplan.js"
import viking_village from "./levels/viking_village.js"

export const levelScripts = {
	viking_village,
	gym: null,
} satisfies Record<HuLevel, LevelScript | null>

