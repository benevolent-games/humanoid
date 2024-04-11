
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

export class Entity<Sel extends Ecs.Selector = Ecs.Selector> extends Ecs.Entity<Sel> {}
export abstract class HybridComponent<State extends Ecs.Serializable = Ecs.Serializable> extends Ecs.HybridComponent<HuRealm, State> {}
export class Component<State extends Ecs.Serializable = Ecs.Serializable> extends Ecs.Component<State> {}
export class Archetype<Sel extends Ecs.Selector> extends Ecs.Archetype<Sel> {}
export class World extends Ecs.World<HuRealm> {}

export const arch = (
	<Sel extends Ecs.Selector>(selector: Sel, state: Ecs.State<Sel>) => (
		new Archetype(selector, state)
	)
)

