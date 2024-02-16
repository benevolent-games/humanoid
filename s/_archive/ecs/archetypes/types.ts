
import {HumanoidSchema} from "../schema.js"

export type Archetype = (...args: any[]) => Partial<HumanoidSchema>

export function archetype<Fn extends Archetype>(fn: Fn) {
	return fn
}

