
import {Hub} from "@benev/toolbox"
import {HuRealm} from "../models/realm/realm.js"

export type HuTick = {
	hz: number
	count: number
	seconds: number
	gametime: number
}

export const hub = new Hub<HuRealm, HuTick>()
export const {system, behavior, responder} = hub

