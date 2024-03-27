
import {Ecs} from "@benev/toolbox"
import {HuRealm} from "../models/realm/realm.js"

export type HuTick = {
	hz: number
	count: number
	seconds: number
	gametime: number
}

export const hub = new Ecs.Hub<HuRealm, HuTick>()
export const {system, behavior, responder, logic} = hub

export const HybridComponent = hub.HybridComponent
export const Component = Ecs.Component
export const Archetype = Ecs.Archetype

