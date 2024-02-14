
import {Hub} from "@benev/toolbox/x/ecs/ecs6.js"
import {HumanoidRealm} from "../models/realm/realm.js"

export type HumanoidTick = {
	hz: number
	count: number
	seconds: number
	gametime: number
}

export const hub = new Hub<HumanoidRealm, HumanoidTick>()
export const {system, behavior} = hub

