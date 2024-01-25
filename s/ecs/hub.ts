
import {Ecs3, Ecs4} from "@benev/toolbox"
import {Realm} from "../models/realm/realm.js"
import {HumanoidSchema, HumanoidTick} from "./schema.js"

export const hub = new Ecs3.Hub<
	Realm,
	HumanoidTick,
	HumanoidSchema
>()

export const {
	setup,
	system,
	behavior,
} = new Ecs4.Hub<Realm, HumanoidTick, HumanoidSchema>()

